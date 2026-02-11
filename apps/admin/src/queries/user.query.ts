import {
  captchaResponseSchema,
  type LoginRequest,
  loginResponseSchema,
} from "@repo/schema";
import { useMutation } from "@tanstack/react-query";
import { request } from "@/lib/request";

export const useLoginMutation = () =>
  useMutation({
    mutationFn: async (data: LoginRequest) => {
      const response = await request.post("/auth/login", data, {
        schema: loginResponseSchema,
      });
      return response;
    },
  });

export const useCaptchaMutation = () =>
  useMutation({
    mutationFn: async () => {
      const response = await request.get("/auth/captcha", {
        schema: captchaResponseSchema,
      });
      return response;
    },
  });
