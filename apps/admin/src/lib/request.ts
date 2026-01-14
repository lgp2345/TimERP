import type { z } from "zod";
import { useAppStore } from "@/store/useAppStore";

type RequestConfig = {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  params?: Record<string, string | number | boolean | undefined | null>;
  data?: unknown;
  headers?: Record<string, string>;
  schema?: z.ZodType;
};

type Interceptor<T> = (value: T) => T | Promise<T>;

class Request {
  private baseURL = "";
  private readonly requestInterceptors: Interceptor<RequestConfig>[] = [];
  private readonly responseInterceptors: Interceptor<Response>[] = [];

  setBaseURL(url: string) {
    this.baseURL = url;
    return this;
  }

  interceptors = {
    request: {
      use: (interceptor: Interceptor<RequestConfig>) => {
        this.requestInterceptors.push(interceptor);
      },
    },
    response: {
      use: (interceptor: Interceptor<Response>) => {
        this.responseInterceptors.push(interceptor);
      },
    },
  };

  async request<T = unknown>(config: RequestConfig): Promise<T> {
    let finalConfig = { ...config };

    for (const interceptor of this.requestInterceptors) {
      finalConfig = await interceptor(finalConfig);
    }

    const {
      url,
      method = "GET",
      params,
      data,
      headers = {},
      schema,
    } = finalConfig;

    const token = useAppStore.getState().accessToken;
    if (token) {
      headers.authorization = `Bearer ${token}`;
    }

    let finalUrl = this.baseURL + url;
    if (params) {
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
    }

    let response = await fetch(finalUrl, {
      method,
      headers: {
        "content-type": "application/json",
        ...headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });

    for (const interceptor of this.responseInterceptors) {
      response = await interceptor(response);
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const json = await response.json();

    if (schema) {
      return schema.parse(json) as T;
    }

    return json as T;
  }

  get<T = unknown>(
    url: string,
    config?: Omit<RequestConfig, "url" | "method">
  ) {
    return this.request<T>({ ...config, url, method: "GET" });
  }

  post<T = unknown>(
    url: string,
    data?: unknown,
    config?: Omit<RequestConfig, "url" | "method" | "data">
  ) {
    return this.request<T>({ ...config, url, method: "POST", data });
  }

  put<T = unknown>(
    url: string,
    data?: unknown,
    config?: Omit<RequestConfig, "url" | "method" | "data">
  ) {
    return this.request<T>({ ...config, url, method: "PUT", data });
  }

  delete<T = unknown>(
    url: string,
    config?: Omit<RequestConfig, "url" | "method">
  ) {
    return this.request<T>({ ...config, url, method: "DELETE" });
  }

  patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: Omit<RequestConfig, "url" | "method" | "data">
  ) {
    return this.request<T>({ ...config, url, method: "PATCH", data });
  }
}

export const request = new Request();
