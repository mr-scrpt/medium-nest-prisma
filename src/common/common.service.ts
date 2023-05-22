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

  IsNotEmptyObject(obj: object): boolean {
    return obj && Object.keys(obj).length !== 0;
  }
}
