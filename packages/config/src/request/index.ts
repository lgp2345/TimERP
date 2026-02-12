export const REQUEST_CONFIG = {
  prefix: "api",
  version: "1",
  versionPrefix: "v",
} as const;

export type ApiResponse<T> = {
  status: number;
  data: T;
  message: string;
};
