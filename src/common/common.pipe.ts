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
    console.log('value', value);
    console.log('metadata', metadata);
    return value;
    const object = plainToClass(metadata.metatype, value);
    const errors = await validate(object);

    // console.log('object', object);
    // console.log('errors', errors);

    if (!errors.length) {
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
    return errors.reduce((acc, error) => {
      acc[error.property] = Object.values(error.constraints);
      return acc;
    }, {});
  }
}
