import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { ResponseErrorInterface } from './common.interface';
interface ErrorResponse {
  errors: string | string[];
}
interface StandartErrorResponse {
  statusCode: number;
  message: string[];
  error: string;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    console.log('in HttpExceptionFilter');
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const message = exception.getResponse() as
      | string
      | ErrorResponse
      | StandartErrorResponse
      | ResponseErrorInterface;

    let responseMessage: ResponseErrorInterface;

    if (typeof message === 'string') {
      responseMessage = {
        errors: { validate: [message] },
      };
    } else if (typeof message === 'object' && 'errors' in message) {
      responseMessage = message as ResponseErrorInterface;
    } else if (typeof message === 'object' && 'error' in message) {
      responseMessage = {
        errors: { errorField: [message.error] },
      };
    }

    response.status(status).json(responseMessage);
  }
}
