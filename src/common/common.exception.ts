import { HttpException } from '@nestjs/common';

export class HttpExceptionCustom extends HttpException {
  constructor(message: string, statusCode: number) {
    super({ errors: { 'Error: ': message } }, statusCode);
  }
}
