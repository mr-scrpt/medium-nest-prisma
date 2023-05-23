export enum ArticleOrderDirectionEnum {
  DESC = 'desc',
  ASC = 'asc',
}

export enum ArticleOrderFieldEnum {
  TITLE = 'title',
  CREATED_AT = 'createdAt',
}

export interface IArticleSelect extends IArticlePageSelect {
  orderBy: IArticleOrderSelect;
}

export interface IArticlePageSelect {
  limit: number;
  offset: number;
}

export interface IArticleOrderSelect {
  field: ArticleOrderFieldEnum;
  direction: ArticleOrderDirectionEnum;
}
