import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  PipeTransform,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

export class CustomValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (value === null || value === undefined) {
      return value; // Пропускаем null и undefined значения без валидации
    }
    if (typeof value === 'string') {
      console.log('value', value);
      return value.trim(); // Удаляем пробелы по краям строки
    }

    const object = plainToClass(metadata.metatype, value);
    const errors = await validate(object);

    if (errors.length === 0) {
      return value;
    }

    throw new HttpException(
      {
        errors: this.buildError(errors),
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }

  buildError(errors: ValidationError[]) {
    const result = {};

    errors.forEach((error) => {
      if (error.children && error.children.length > 0) {
        result[error.property] = this.buildError(error.children);
      } else {
        result[error.property] = Object.values(error.constraints);
      }
    });
    console.log(result);

    return result;
  }
}
