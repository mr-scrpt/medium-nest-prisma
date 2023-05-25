import {
  IArticleQueryParamsRequered,
  IArtilceQueryParamsOptional,
  SortByArticleEnum,
  SortDirectionEnum,
} from '@app/article/interface/query.interface';

const DEFAULT_LIMIT = 20;
const DEFAULT_OFFSET = 0;
const DEFAULT_ORDER_BY = SortByArticleEnum.TITLE;
const DEFAULT_DIRECTION = SortDirectionEnum.ASC;

export const parseQueryParams = (
  query: IArtilceQueryParamsOptional,
): IArticleQueryParamsRequered => {
  const { limit, offset, orderBy, direction, tag, author, favorited } = query;

  const parsedParams: IArticleQueryParamsRequered = {
    limit: limit !== undefined ? +limit : DEFAULT_LIMIT,
    offset: offset !== undefined ? +offset : DEFAULT_OFFSET,
    orderBy: orderBy !== undefined ? orderBy : DEFAULT_ORDER_BY,
    direction: direction !== undefined ? direction : DEFAULT_DIRECTION,
    tag: tag !== undefined ? tag : undefined,
    author: author !== undefined ? author : undefined,
    favorited: favorited !== undefined ? favorited : undefined,
  };

  return parsedParams;
};

// export const parseWhereParams = (
//   query: IArtilceQueryParamsOptional,
// ): IArticleWhereParamsRequered => {
//   const { tag, author } = query;

//   const parsedParams: IArticleWhereParamsRequered = {
//     tagList: tag !== undefined ? { has: tag } : undefined,
//     author: author !== undefined ? { username: author } : undefined,
//   };

//   return parsedParams;
// };
