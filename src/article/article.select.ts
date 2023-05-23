import {
  ArticleOrderDirectionEnum,
  ArticleOrderFieldEnum,
  IArticleOrderSelect,
  IArticlePageSelect,
} from './interface/query.interface';

export const authorBaseSelect = {
  username: true,
  email: true,
  bio: true,
  image: true,
};

export const articleQueryParams = (
  parms: IArticlePageSelect,
  order: IArticleOrderSelect,
) => ({
  ...articlePageSelect(parms),
  ...articleOrderSelect(order),
});

export const articlePageSelect = (parms: IArticlePageSelect) => ({
  limit: +parms.limit || 20,
  offset: +parms.offset || 0,
});

export const articleOrderSelect = (order: IArticleOrderSelect) => {
  let orderField: ArticleOrderFieldEnum;
  let orderDirection: ArticleOrderDirectionEnum;

  // Проверка значения order.field
  if (Object.values(ArticleOrderFieldEnum).includes(order.field)) {
    orderField = order.field;
  } else {
    orderField = ArticleOrderFieldEnum.TITLE; // Значение по умолчанию
  }

  // Проверка значения order.direction
  if (Object.values(ArticleOrderDirectionEnum).includes(order.direction)) {
    orderDirection = order.direction;
  } else {
    orderDirection = ArticleOrderDirectionEnum.ASC; // Значение по умолчанию
  }

  return {
    orderBy: {
      [orderField]: orderDirection,
    },
  };
};
