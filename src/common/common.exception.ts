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

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    console.log('HttpExceptionFilter');
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    let message = exception.getResponse() as string | ErrorResponse;
    console.log(message);
    if (typeof message === 'string') {
      message = {
        errors: {
          body: [message || 'Internal server error'],
        },
      };
    } else {
      console.log('message', message);
      const errorArray = Object.values(message.errors).flat();
      message = {
        errors: {
          body: errorArray,
        },
      };
    }

    response.status(status).json(message);
  }
}
