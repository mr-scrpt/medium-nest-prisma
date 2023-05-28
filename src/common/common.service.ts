import { Injectable } from '@nestjs/common';
import slugify from 'slugify';

const slugifyConfig = {
  remove: undefined,
  lower: true,
  strict: false,
  locale: 'vi',
  trim: true,
};
@Injectable()
export class CommonService {
  slugGenerator(str: string): string {
    return slugify(str, slugifyConfig);
  }

  isNotEmptyObject(obj: object): boolean {
    return obj && Object.keys(obj).length !== 0;
  }

  exclude = <T, Key extends keyof T>(entity: T, keys: Key[]): Omit<T, Key> => {
    for (const key of keys) {
      delete entity[key];
    }
    return entity;
  };
}
