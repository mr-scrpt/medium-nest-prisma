import { Injectable } from '@nestjs/common';
import slugify from 'slugify';

const slugifyConfig = {
  remove: undefined,
  lower: false,
  strict: false,
  locale: 'vi',
  trim: true,
};
@Injectable()
export class CommonService {
  slugGenerator(str: string): string {
    return slugify(str, slugifyConfig);
  }
}
