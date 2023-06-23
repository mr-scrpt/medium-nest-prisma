import {
  Controller,
  Post,
  UseGuards,
  Body,
  Headers,
  UsePipes,
  ValidationPipe,
  Get,
  Query,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ArticleService } from '@app/article/article.service';
import { AuthGuard } from '@app/auth/guard/auth.guard';
import { ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { ReqArticleCreateDto } from './dto/reqArticleCreate.dto';
import { ArticleCreateDto } from '@app/article/dto/articleCreate.dto';
import { IArtilceQueryParamsOptional } from './article.interface';
import { ResArticleDto } from './dto/resArticle.dto';
import { ResArticeFeedDto } from './dto/resArticleFeed.dto';
import { Token } from '@app/auth/iterface/auth.interface';
import { parseQueryParams } from './article.helper';
import { ReqArticleUpdateDto } from './dto/reqArticleUpdate.dto';
import { ArticleUpdateDto } from './dto/articleUpdate.dto';

@ApiTags('articles')
@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  // @Get('test')
  // async test(): Promise<void> {
  //   console.log('test');
  //   this.articleService.getTestArticle();
  // }

  @Get()
  @ApiCreatedResponse({ type: ResArticeFeedDto })
  @UsePipes(new ValidationPipe())
  async getArticleAll(
    @Headers('Authorization') token: Token,
    @Query() query: IArtilceQueryParamsOptional,
  ): Promise<ResArticeFeedDto> {
    const params = parseQueryParams(query);
    return await this.articleService.getArticleAllByParamsAndToken(
      params,
      token,
    );
  }

  @UseGuards(AuthGuard)
  @Get('feed')
  @ApiCreatedResponse({ type: ResArticeFeedDto })
  @UsePipes(new ValidationPipe())
  async getArticleFeed(
    @Headers('Authorization') token: Token,
    @Query() query: IArtilceQueryParamsOptional,
  ): Promise<ResArticeFeedDto> {
    const params = parseQueryParams(query);
    return await this.articleService.getArticleFollowByParamsAndToken(
      params,
      token,
    );
  }

  @Get(':slug')
  @ApiCreatedResponse({ type: ResArticleDto })
  @UsePipes(new ValidationPipe())
  async getArticleBySlug(
    @Headers('Authorization') auth: string | undefined,
    @Param('slug') slug: string,
  ): Promise<ResArticleDto> {
    return await this.articleService.getArticleBySlugAndToken(slug, auth);
  }

  @UseGuards(AuthGuard)
  @Post()
  @ApiBody({ type: ReqArticleCreateDto })
  @ApiCreatedResponse({ type: ReqArticleCreateDto })
  @UsePipes(new ValidationPipe())
  async createArticle(
    @Headers('Authorization') auth: string | undefined,
    @Body('article') articleCreateDto: ArticleCreateDto,
  ): Promise<ResArticleDto> {
    return await this.articleService.createArticle(articleCreateDto, auth);
  }

  @UseGuards(AuthGuard)
  @Put(':slug')
  @ApiBody({ type: ReqArticleUpdateDto })
  @ApiCreatedResponse({ type: ReqArticleUpdateDto })
  @UsePipes(new ValidationPipe())
  async updateArticleBySlug(
    @Headers('Authorization') auth: string | undefined,
    @Param('slug') slug: string,
    @Body('article') articleUpdatedDto: ArticleUpdateDto,
  ): Promise<ResArticleDto> {
    return await this.articleService.updateArticleBySlugAndToken(
      slug,
      articleUpdatedDto,
      auth,
    );
  }

  @UseGuards(AuthGuard)
  @Delete(':slug')
  @UsePipes(new ValidationPipe())
  async deleteArticleBySlug(
    @Headers('Authorization') auth: string | undefined,
    @Param('slug') slug: string,
  ): Promise<void> {
    console.log('deleteArticleBySlug');
    return await this.articleService.deleteArticleBySlugAndToken(slug, auth);
  }

  @UseGuards(AuthGuard)
  @Post(':slug/favorite')
  @ApiCreatedResponse({ type: ResArticleDto })
  @UsePipes(new ValidationPipe())
  async addFavoriteBySlug(
    @Headers('Authorization') auth: string | undefined,
    @Param('slug') slug: string,
  ): Promise<ResArticleDto> {
    return await this.articleService.addToFavorite(slug, auth);
  }

  @UseGuards(AuthGuard)
  @Delete(':slug/favorite')
  @ApiCreatedResponse({ type: ResArticleDto })
  @UsePipes(new ValidationPipe())
  async deleteFavoriteBySlug(
    @Headers('Authorization') auth: string | undefined,
    @Param('slug') slug: string,
  ): Promise<ResArticleDto> {
    return await this.articleService.deleteFromFavorite(slug, auth);
  }
}
