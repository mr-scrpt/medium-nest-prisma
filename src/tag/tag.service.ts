import { Injectable } from '@nestjs/common';
import { TagEntity } from '@app/tag/entity/tag.entity';

@Injectable()
export class TagService {
  findAll(): Array<TagEntity> {
    return [
      {
        id: 1,
        name: 'tag1',
      },
    ];
  }
}
