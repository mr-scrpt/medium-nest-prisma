import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
interface ErrorResponse {
  errors: Record<string, string[]>;
}
interface StandartErrorResponse {
  statusCode: number;
  message: string[];
  error: string;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    console.log('HttpExceptionFilter');
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    let message = exception.getResponse() as
      | string
      | ErrorResponse
      | StandartErrorResponse;

    if (typeof message === 'string') {
      message = {
        errors: {
          body: [message || 'Internal server error'],
        },
      };
    }
    if (typeof message === 'object' && 'errors' in message) {
      // console.log('message', message);
      const errorArray = Object.values(message.errors).flat();

      message = {
        errors: {
          body: errorArray,
        },
      };
    }
    if (typeof message === 'object' && 'error' in message) {
      message = {
        errors: {
          body: [message.error],
        },
      };
    }

    response.status(status).json(message);
  }
}
