import { type ApiResponse, REQUEST_CONFIG } from "@repo/config/request";
import { toast } from "sonner";
import type { z } from "zod";
import { useAuthStore } from "@/store/useAuthStore";

type RequestConfig<TSchema extends z.ZodType | undefined = undefined> = {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  params?: Record<string, string | number | boolean | undefined | null>;
  data?: unknown;
  headers?: Record<string, string>;
  schema?: TSchema;
};

type InferResponse<
  TSchema extends z.ZodType | undefined,
  TDefault = unknown,
> = TSchema extends z.ZodType ? z.infer<TSchema> : TDefault;

type Interceptor<T> = (value: T) => T | Promise<T>;

class Request {
  private baseURL = import.meta.env.VITE_SERVER_HOST;
  private readonly requestInterceptors: Interceptor<
    RequestConfig<z.ZodType | undefined>
  >[] = [];
  private readonly responseInterceptors: Interceptor<Response>[] = [];
  private readonly pendingRequests = new Map<string, AbortController>();

  setBaseURL(url: string) {
    this.baseURL = url;
    return this;
  }

  interceptors = {
    request: {
      use: (interceptor: Interceptor<RequestConfig<z.ZodType | undefined>>) => {
        this.requestInterceptors.push(interceptor);
      },
    },
    response: {
      use: (interceptor: Interceptor<Response>) => {
        this.responseInterceptors.push(interceptor);
      },
    },
  };

  private getRequestKey(config: RequestConfig<z.ZodType | undefined>): string {
    const { url, method = "GET", params, data } = config;
    return JSON.stringify({ url, method, params, data });
  }

  private buildUrl(url: string, params?: RequestConfig["params"]): string {
    let finalUrl = `${this.baseURL}/${REQUEST_CONFIG.prefix}/${REQUEST_CONFIG.versionPrefix + REQUEST_CONFIG.version}${url}`;
    if (!params) {
      return finalUrl;
    }

    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    }
    const queryString = searchParams.toString();
    if (queryString) {
      finalUrl += `?${queryString}`;
    }
    return finalUrl;
  }

  private async processResponse(
    response: Response,
    schema?: z.ZodType
  ): Promise<unknown> {
    const parseApiResponse = async () => {
      const json = (await response.json()) as ApiResponse<unknown>;
      return json;
    };

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const json = await parseApiResponse();
        const message = json.message;
        errorMessage = message ?? errorMessage;
        toast.error(errorMessage);
      } catch {
        // ignore json parse errors and keep fallback message
      }
      throw new Error(errorMessage);
    }

    const apiResponse = await parseApiResponse();
    const payload = apiResponse.data;

    if (schema) {
      return schema.parse(payload);
    }

    return payload;
  }

  async request<
    TSchema extends z.ZodType | undefined = undefined,
    TDefault = unknown,
  >(config: RequestConfig<TSchema>): Promise<InferResponse<TSchema, TDefault>> {
    let finalConfig: RequestConfig<z.ZodType | undefined> = {
      ...config,
    } as RequestConfig<z.ZodType | undefined>;

    for (const interceptor of this.requestInterceptors) {
      finalConfig = await interceptor(finalConfig);
    }

    const requestKey = this.getRequestKey(finalConfig);
    const existingController = this.pendingRequests.get(requestKey);
    if (existingController) {
      existingController.abort();
    }

    const abortController = new AbortController();
    this.pendingRequests.set(requestKey, abortController);

    try {
      const {
        url,
        method = "GET",
        params,
        data,
        headers = {},
        schema,
      } = finalConfig;

      const finalUrl = this.buildUrl(url, params);

      let response = await fetch(finalUrl, {
        method,
        headers: {
          "content-type": "application/json",
          ...headers,
        },
        body: data ? JSON.stringify(data) : undefined,
        credentials: "include",
        signal: abortController.signal,
      });

      for (const interceptor of this.responseInterceptors) {
        response = await interceptor(response);
      }

      return (await this.processResponse(response, schema)) as InferResponse<
        TSchema,
        TDefault
      >;
    } finally {
      this.pendingRequests.delete(requestKey);
    }
  }

  get<TSchema extends z.ZodType | undefined = undefined, TDefault = unknown>(
    url: string,
    config?: Omit<RequestConfig<TSchema>, "url" | "method">
  ): Promise<InferResponse<TSchema, TDefault>> {
    return this.request<TSchema, TDefault>({
      ...config,
      url,
      method: "GET",
    } as RequestConfig<TSchema>);
  }

  post<TSchema extends z.ZodType | undefined = undefined, TDefault = unknown>(
    url: string,
    data?: unknown,
    config?: Omit<RequestConfig<TSchema>, "url" | "method" | "data">
  ): Promise<InferResponse<TSchema, TDefault>> {
    return this.request<TSchema, TDefault>({
      ...config,
      url,
      method: "POST",
      data,
    } as RequestConfig<TSchema>);
  }

  put<TSchema extends z.ZodType | undefined = undefined, TDefault = unknown>(
    url: string,
    data?: unknown,
    config?: Omit<RequestConfig<TSchema>, "url" | "method" | "data">
  ): Promise<InferResponse<TSchema, TDefault>> {
    return this.request<TSchema, TDefault>({
      ...config,
      url,
      method: "PUT",
      data,
    } as RequestConfig<TSchema>);
  }

  delete<TSchema extends z.ZodType | undefined = undefined, TDefault = unknown>(
    url: string,
    config?: Omit<RequestConfig<TSchema>, "url" | "method">
  ): Promise<InferResponse<TSchema, TDefault>> {
    return this.request<TSchema, TDefault>({
      ...config,
      url,
      method: "DELETE",
    } as RequestConfig<TSchema>);
  }

  patch<TSchema extends z.ZodType | undefined = undefined, TDefault = unknown>(
    url: string,
    data?: unknown,
    config?: Omit<RequestConfig<TSchema>, "url" | "method" | "data">
  ): Promise<InferResponse<TSchema, TDefault>> {
    return this.request<TSchema, TDefault>({
      ...config,
      url,
      method: "PATCH",
      data,
    } as RequestConfig<TSchema>);
  }
}

export const request = new Request();

request.interceptors.request.use((config) => {
  const token = useAuthStore.getState().loginContext?.accessToken;
  if (!token) {
    return config;
  }
  return {
    ...config,
    headers: {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    },
  };
});
