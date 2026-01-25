import { type loginRequestSchema, loginResponseSchema } from "@repo/schema";
import { useMutation } from "@tanstack/react-query";
import type { z } from "zod";
import { request } from "@/lib/request";

export const useLoginMutation = () =>
  useMutation({
    mutationFn: async (data: z.infer<typeof loginRequestSchema>) => {
      const response = await request.post("/auth/login", data, {
        schema: loginResponseSchema,
      });
      return response;
    },
  });
