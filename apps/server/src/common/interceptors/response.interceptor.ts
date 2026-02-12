import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  type NestInterceptor,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { ApiResponse } from "@repo/config/request";
import { map, type Observable } from "rxjs";
import { RESPONSE_MESSAGE_METADATA_KEY } from "../decorators/response-message.decorator";

/**
 * Wrap successful responses into the unified API shape.
 */
@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  constructor(private readonly reflector: Reflector) {}

  /**
   * Intercepts successful responses and wraps them with code/message/data.
   */
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        const message =
          this.reflector.getAllAndOverride<string>(
            RESPONSE_MESSAGE_METADATA_KEY,
            [context.getHandler(), context.getClass()]
          ) ?? "ok";
        return {
          status: 200,
          data,
          message,
        };
      })
    );
  }
}
