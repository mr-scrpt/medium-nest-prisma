export enum SortDirectionEnum {
  DESC = 'desc',
  ASC = 'asc',
}

export enum SortByArticleEnum {
  TITLE = 'title',
  CREATED_AT = 'createdAt',
}

type Nullable<T> = {
  [K in keyof T]?: T[K];
};

type Required<T> = {
  [K in keyof T]-?: T[K];
};

interface IQueryParamsBase {
  limit?: number;
  offset?: number;
  orderBy?: SortByArticleEnum;
  direction?: SortDirectionEnum;
  tag?: string;
  author?: string;
  favorited?: string;
}

export type IArtilceQueryParamsOptional = Nullable<IQueryParamsBase>;

export type IArticleQueryParamsRequered = Required<IQueryParamsBase>;
