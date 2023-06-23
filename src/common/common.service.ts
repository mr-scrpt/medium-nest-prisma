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

  filterEmptyObject(obj: object): object {
    return Object.keys(obj).reduce((acc, key) => {
      if (obj[key]) {
        acc[key] = obj[key];
      }
      return acc;
    }, {});
  }

  exclude = <T, Key extends keyof T>(entity: T, keys: Key[]): Omit<T, Key> => {
    for (const key of keys) {
      delete entity[key];
    }
    return entity;
  };
}
