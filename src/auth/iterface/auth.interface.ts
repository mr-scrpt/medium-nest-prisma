export interface IAuthHeader {
  authorization: Token;
}

export type Token = string | undefined;
