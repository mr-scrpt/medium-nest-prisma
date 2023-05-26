// import {
//   ArticleOrderDirectionEnum,
//   ArticleOrderFieldEnum,
//   IArticleOrderSelect,
//   IArticlePageSelect,
//   IArticleWhereParams,
// } from './interface/query.interface';

export const authorBaseSelect = {
  username: true,
  bio: true,
  image: true,
};

export const favoritedBaseSelect = {
  id: true,
  userId: true,
  articleId: true,
};

// export const articleQueryParams = (
//   parms: IArticlePageSelect,
//   order: IArticleOrderSelect,
// ) => ({
//   ...articlePageSelect(parms),
//   ...articleOrderSelect(order),
// });

// export const articleWhereParams = (parms: IArticleWhereParams) => {
//   const where: any = {};

//   if (parms.tag) {
//     where.tagList = {
//       has: parms.tag,
//     };
//   }

//   if (parms.author) {
//     where.author = {
//       username: parms.author,
//     };
//   }

//   if (parms.favorited) {
//     where.favoritedBy = {
//       username: parms.favorited,
//     };
//   }

//   return where;
// };

// export const articlePageSelect = (parms: IArticlePageSelect) => ({
//   limit: +parms.limit || 20,
//   offset: +parms.offset || 0,
// });

// export const articleOrderSelect = (order: IArticleOrderSelect) => {
//   let orderField: ArticleOrderFieldEnum;
//   let orderDirection: ArticleOrderDirectionEnum;

//   // Проверка значения order.field
//   if (Object.values(ArticleOrderFieldEnum).includes(order.field)) {
//     orderField = order.field;
//   } else {
//     orderField = ArticleOrderFieldEnum.TITLE; // Значение по умолчанию
//   }

//   // Проверка значения order.direction
//   if (Object.values(ArticleOrderDirectionEnum).includes(order.direction)) {
//     orderDirection = order.direction;
//   } else {
//     orderDirection = ArticleOrderDirectionEnum.ASC; // Значение по умолчанию
//   }

//   return {
//     orderBy: {
//       [orderField]: orderDirection,
//     },
//   };
// };
