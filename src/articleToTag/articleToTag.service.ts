import { Injectable } from '@nestjs/common';
import { ArticleToTagRepository } from '@app/articleToTag/articleToTag.repository';

@Injectable()
export class ArticleToTagService {
  constructor(
    private readonly articleToTagRepository: ArticleToTagRepository,
  ) {}

  async deleteNotExistArticleToTag(
    articleId: number,
    existingTagIds: number[],
  ): Promise<void> {
    await this.articleToTagRepository.deleteNotExistArticleToTag(
      articleId,
      existingTagIds,
    );
  }
}
