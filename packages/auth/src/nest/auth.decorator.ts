import { createParamDecorator, type ExecutionContext } from "@nestjs/common";
import { type TenantRequest } from "./request-types";

export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest() as TenantRequest;
  return req.user ?? null;
});

export const CurrentTenant = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest() as TenantRequest;
  return req.tenant ?? null;
});


