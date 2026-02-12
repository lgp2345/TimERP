import {
  ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import type { ApiResponse } from "@repo/config/request";
import type { FastifyReply } from "fastify";

type ApiErrorResponse = ApiResponse<null>;

/**
 * Converts all exceptions into the unified API error shape.
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  /**
   * Catches known and unknown errors and serializes them consistently.
   */
  catch(exception: unknown, host: ArgumentsHost): void {
    const http = host.switchToHttp();
    const response = http.getResponse<FastifyReply>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "Internal server error";

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const payload = exception.getResponse();
      if (typeof payload === "string") {
        message = payload;
      } else if (
        payload &&
        typeof payload === "object" &&
        "message" in payload
      ) {
        const value = (payload as { message?: string | string[] }).message;
        if (Array.isArray(value)) {
          message = value[0] ?? message;
        } else if (typeof value === "string") {
          message = value;
        }
      }
    } else if (exception instanceof Error) {
      message = exception.message || message;
    }

    const body: ApiErrorResponse = {
      status,
      data: null,
      message,
    };
    response.status(status).send(body);
  }
}
