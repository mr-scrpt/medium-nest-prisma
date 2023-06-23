import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ArticleEntity } from './entity/article.entity';
import { ArticleWithRelationEntity } from './entity/aticleWithRelation.entity';

@Injectable()
export class ArticleCheck {
  isCreated(article: ArticleEntity): boolean {
    if (!article) {
      throw new HttpException('Article not created', HttpStatus.BAD_REQUEST);
    }
    return true;
  }

  isUpdated(article: ArticleEntity): boolean {
    if (!article) {
      throw new HttpException('Article not updated', HttpStatus.BAD_REQUEST);
    }
    return true;
  }

  isDeleted(article: ArticleEntity | undefined): boolean {
    if (article) {
      throw new HttpException('Article not deleted', HttpStatus.BAD_REQUEST);
    }
    return true;
  }

  isNotExist(article: ArticleEntity | undefined): boolean {
    if (article) {
      throw new HttpException(
        'Article with this slug already exist',
        HttpStatus.BAD_REQUEST,
      );
    }
    return true;
  }

  isExist(article: ArticleEntity | undefined): boolean {
    if (!article) {
      throw new HttpException(
        'Article with this slug not found',
        HttpStatus.BAD_REQUEST,
      );
    }
    return true;
  }

  isInFavorites(isFavorite: boolean): void {
    if (isFavorite) {
      throw new HttpException(
        'This article is already in favorites',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  isNotInFavorites(isFavorite: boolean): void {
    if (!isFavorite) {
      throw new HttpException(
        'This article is not in favorites',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  isAuthor(articleId: number, currentUserId: number): void {
    if (articleId !== currentUserId) {
      throw new HttpException(
        'You are not the author of this article',
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
