import {
  Controller,
  Post,
  Get,
  UseGuards,
  Body,
  Headers,
  ValidationPipe,
  UsePipes,
  Param,
} from '@nestjs/common';
import { ArticleService } from '@app/article/article.service';
import { AuthGuard } from '@app/auth/guard/auth.guard';
import { ArticleCreateDto } from '@app/article/dto/articleCreate.dto';
import { UserService } from '@app/user/user.service';
import { ApiBody, ApiCreatedResponse } from '@nestjs/swagger';
import { ArticleBuildResponseDto } from './dto/articleBuildResponse.dto';

@Controller('article')
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  @ApiBody({ type: ArticleCreateDto })
  @ApiCreatedResponse({ type: ArticleBuildResponseDto })
  @UsePipes(new ValidationPipe())
  async createArticle(
    @Headers('Authorization') auth: string | undefined,
    @Body() articleCreateDto: ArticleCreateDto,
  ): Promise<ArticleBuildResponseDto> {
    const user = await this.userService.getUserByToken(auth);
    const article = await this.articleService.createArticle(
      user,
      articleCreateDto,
    );

    return this.articleService.buildArticleResponse(article);
  }

  @Get(':slug')
  @ApiBody({ type: String })
  @ApiCreatedResponse({ type: ArticleBuildResponseDto })
  @UsePipes(new ValidationPipe())
  async getArticleBySlug(
    @Param('slug') slug: string,
  ): Promise<ArticleBuildResponseDto> {
    const article = await this.articleService.getArticleBySlug(slug);
    return this.articleService.buildArticleResponse(article);
  }
}
