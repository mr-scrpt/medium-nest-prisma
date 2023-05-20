import {
  Controller,
  Post,
  UseGuards,
  Body,
  Headers,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { ArticleService } from '@app/article/article.service';
import { AuthGuard } from '@app/auth/guard/auth.guard';
import { ArticleCreateDto } from '@app/article/dto/articleCreate.dto';
import { UserService } from '@app/user/user.service';
import { ApiBody } from '@nestjs/swagger';
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
  @UsePipes(new ValidationPipe())
  async createArticle(
    @Headers('Authorization') auth: string | undefined,
    @Body() articleCreateDto: ArticleCreateDto,
  ): Promise<any> {
    const user = await this.userService.getUserByToken(auth);
    const article = await this.articleService.createArticle(
      user,
      articleCreateDto,
    );

    // // return this.articleService.buildArticleResponse(article);
    // return article;
    return article;
  }
}
