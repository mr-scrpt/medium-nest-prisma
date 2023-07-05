import { HttpExceptionCustom } from '@app/common/common.exception';
import { HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class ArticleCheck {
  isCreated(bool: boolean): boolean {
    if (!bool) {
      throw new HttpExceptionCustom(
        'Article not created',
        HttpStatus.BAD_REQUEST,
      );
    }
    return true;
  }

  isUpdated(bool: boolean): boolean {
    if (!bool) {
      throw new HttpExceptionCustom(
        'Article not updated',
        HttpStatus.BAD_REQUEST,
      );
    }
    return true;
  }

  isDeleted(bool: boolean): boolean {
    if (bool) {
      throw new HttpExceptionCustom(
        'Article not deleted',
        HttpStatus.BAD_REQUEST,
      );
    }
    return true;
  }

  isNotExist(bool: boolean | undefined): boolean {
    if (bool) {
      throw new HttpExceptionCustom(
        'Article with this slug already exist',
        HttpStatus.BAD_REQUEST,
      );
    }
    return true;
  }

  isExist(bool: boolean | undefined): boolean {
    if (!bool) {
      throw new HttpExceptionCustom(
        'Article with this slug not found',
        HttpStatus.BAD_REQUEST,
      );
    }
    return true;
  }

  isInFavorites(bool: boolean): boolean {
    if (bool) {
      throw new HttpExceptionCustom(
        'This article is already in favorites',
        HttpStatus.BAD_REQUEST,
      );
    }
    return true;
  }

  isNotInFavorites(bool: boolean): boolean {
    if (!bool) {
      throw new HttpExceptionCustom(
        'This article is not in favorites',
        HttpStatus.BAD_REQUEST,
      );
    }
    return true;
  }

  isAuthor(bool: boolean): boolean {
    if (!bool) {
      throw new HttpExceptionCustom(
        'You are not the author of this article',
        HttpStatus.FORBIDDEN,
      );
    }
    return true;
  }
}
