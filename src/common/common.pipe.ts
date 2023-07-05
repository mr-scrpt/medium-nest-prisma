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
    // console.log('in pipe', value, metadata);
    // if (value === null || value === undefined) {
    //   return value; // Пропускаем null и undefined значения без валидации
    // }
    if (typeof value === 'string') {
      return value.trim(); // Удаляем пробелы по краям строки
    }

    if (this.isEmpty(value)) {
      throw new HttpException(
        'Validation failed: No body submitted',
        HttpStatus.BAD_REQUEST,
      );
    }

    const object = plainToClass(metadata.metatype, value);
    if (typeof object !== 'object') {
      return value;
    }
    const errors = await validate(object);

    if (errors.length === 0) {
      console.log('in pipe no errors');
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

    return result;
  }

  isEmpty(value: any) {
    if (Object.keys(value).length > 0) {
      return false;
    }
    return true;
  }
}
