import { ArticleToTagRepository } from '@app/articleToTag/articleToTag.repository';
import { Transaction } from '@app/common/common.transaction';
import { Tx } from '@app/common/common.type';
import { PrismaService } from '@app/prisma/prisma.service';
import { TagRepository } from '@app/tag/tag.repository';
import { Injectable } from '@nestjs/common';
import { ArticleCheck } from './article.check';
import { ArticleRepository } from './article.repository';
import { ArticleToDBDto } from './dto/db/articleToDB.dto';
import { ArticleEntity } from './entity/article.entity';

@Injectable()
export class ArticleTransaction extends Transaction {
  constructor(
    readonly prisma: PrismaService,
    private readonly articleRepository: ArticleRepository,
    private readonly tagRepository: TagRepository,
    private readonly articleToTagRepository: ArticleToTagRepository,
    private readonly articleCheck: ArticleCheck,
  ) {
    super(prisma);
  }

  async createArticleTransaction(
    articleToDBDto: ArticleToDBDto,
    tagName: string[],
  ): Promise<void> {
    const action = async (tx: Tx): Promise<ArticleEntity> => {
      await this.tagRepository.createTagByList(tagName, tx);

      const tagList = await this.tagRepository.getTagListByNameList(
        tagName,
        tx,
      );

      const article = await this.articleRepository.createArticle(
        articleToDBDto,
        tx,
      );

      await this.articleToTagRepository.createNewArticleToTag(
        article.id,
        tagList,
        tx,
      );

      return article;
    };

    const article = await this.start<ArticleEntity>(action);

    this.articleCheck.isCreated(!!article);
  }

  async updateArticleTransaction(
    articleToDBDto: ArticleToDBDto,
    tagName: string[],
    slug: string,
  ): Promise<void> {
    const action = async (tx: Tx) => {
      await this.tagRepository.createTagByList(tagName, tx);

      const tagList = await this.tagRepository.getTagListByNameList(
        tagName,
        tx,
      );

      const article = await this.articleRepository.updateArticle(
        articleToDBDto,
        slug,
        tx,
      );

      const existingTagIds = article.tagList.map((tag) => tag.id);
      await this.articleToTagRepository.deleteNotExistArticleToTag(
        article.id,
        existingTagIds,
        tx,
      );

      const newTags = tagList.filter((tag) => !existingTagIds.includes(tag.id));

      await this.articleToTagRepository.createNewArticleToTag(
        article.id,
        newTags,
        tx,
      );
      await this.tagRepository.deleteUnuseTags(tx);

      return article;
    };

    const article = await this.start<ArticleEntity>(action);

    this.articleCheck.isUpdated(!!article);
  }

  async deleteArticleTransaction(slug: string): Promise<void> {
    const action = async (tx: Tx) => {
      const article = await this.articleRepository.getArticleBySlug(slug, tx);
      const existingTagIds = article.tagList.map((tag) => tag.id); // Получаем текущие id тегов статьи

      await this.articleToTagRepository.deleteNotExistArticleToTag(
        article.id,
        existingTagIds,
        tx,
      );

      await this.articleRepository.deleteArticleBySlug(slug, tx);

      await this.articleToTagRepository.deleteByArticleId(article.id, tx);

      await this.tagRepository.deleteUnuseTags(tx);
    };

    await this.start(action);
    const articleDeleted = await this.articleRepository.getArticleBySlug(slug);
    this.articleCheck.isDeleted(!!articleDeleted);
  }
}
