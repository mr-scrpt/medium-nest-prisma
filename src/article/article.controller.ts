import {
  Controller,
  Post,
  Get,
  Delete,
  UseGuards,
  Body,
  Headers,
  ValidationPipe,
  UsePipes,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { ArticleService } from '@app/article/article.service';
import { AuthGuard } from '@app/auth/guard/auth.guard';
import { ArticleCreateDto } from '@app/article/dto/articleCreate.dto';
import { ApiBody, ApiTags, ApiCreatedResponse } from '@nestjs/swagger';
import { ArticleBuildResponseDto } from '@app/article/dto/articleBuildResponse.dto';
import { ArticleUpdateDto } from '@app/article/dto/articleUpdate.dto';
import { ArticleRequestUpdateDto } from '@app/article/dto/swagger/articleRequestUpdate.dto';
import { ArticleFeedBuildResponseDto } from './dto/articleFeedBuildResponse.dto';
import { parseQueryParams } from './article.helper';
import { Token } from '@app/auth/iterface/auth.interface';
import { IArtilceQueryParamsOptional } from './interface/query.interface';

@ApiTags('article')
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  @ApiCreatedResponse({ type: ArticleFeedBuildResponseDto })
  @UsePipes(new ValidationPipe())
  async getArticleAll(
    @Headers('Authorization') token: Token,
    @Query() query: IArtilceQueryParamsOptional,
  ): Promise<any> {
    const params = parseQueryParams(query);
    return await this.articleService.getArticleAllByParamsAndToken(
      params,
      token,
    );
  }

  // @UseGuards(AuthGuard)
  // @Post()
  // @ApiBody({ type: ArticleCreateDto })
  // @ApiCreatedResponse({ type: ArticleBuildResponseDto })
  // @UsePipes(new ValidationPipe())
  // async createArticle(
  //   @Headers('Authorization') auth: string | undefined,
  //   @Body() articleCreateDto: ArticleCreateDto,
  // ): Promise<ArticleBuildResponseDto> {
  //   const user = await this.userService.getUserByToken(auth);
  //   const article = await this.articleService.createArticle(
  //     user,
  //     articleCreateDto,
  //   );

  //   return this.articleService.buildArticleResponse(article);
  // }

  // @Get(':slug')
  // @ApiCreatedResponse({ type: ArticleBuildResponseDto })
  // @UsePipes(new ValidationPipe())
  // async getArticleBySlug(
  //   @Param('slug') slug: string,
  // ): Promise<ArticleBuildResponseDto> {
  //   const article = await this.articleService.getArticleBySlug(slug);
  //   return this.articleService.buildArticleResponse(article);
  // }

  // @UseGuards(AuthGuard)
  // @Delete(':slug')
  // @UsePipes(new ValidationPipe())
  // async deleteArticleBySlug(
  //   @Headers('Authorization') auth: string | undefined,
  //   @Param('slug') slug: string,
  // ): Promise<void> {
  //   const { id } = await this.userService.getUserByToken(auth);
  //   await this.articleService.deleteArticleBySlug(id, slug);
  // }

  // @UseGuards(AuthGuard)
  // @Put(':slug')
  // @ApiBody({ type: ArticleRequestUpdateDto })
  // @ApiCreatedResponse({ type: ArticleBuildResponseDto })
  // @UsePipes(new ValidationPipe())
  // async updateArticleBySlug(
  //   @Headers('Authorization') auth: string | undefined,
  //   @Param('slug') slug: string,
  //   @Body('article') articleUpdatedDto: ArticleUpdateDto,
  // ): Promise<ArticleBuildResponseDto> {
  //   console.log(articleUpdatedDto);
  //   const { id } = await this.userService.getUserByToken(auth);
  //   const article = await this.articleService.updateArticleBySlug(
  //     id,
  //     slug,
  //     articleUpdatedDto,
  //   );

  //   return this.articleService.buildArticleResponse(article);
  // }

  // @UseGuards(AuthGuard)
  // @Post(':slug/favorite')
  // @ApiCreatedResponse({ type: ArticleBuildResponseDto })
  // @UsePipes(new ValidationPipe())
  // async addFavoriteBySlug(
  //   @Headers('Authorization') auth: string | undefined,
  //   @Param('slug') slug: string,
  // ): Promise<ArticleBuildResponseDto> {
  //   const { id: idUser } = await this.userService.getUserByToken(auth);
  //   const { id: idArticle } = await this.articleService.getArticleBySlug(slug);
  //   const article = await this.articleService.addToFavorite(idUser, idArticle);

  //   return this.articleService.buildArticleResponse(article);
  // }
}
