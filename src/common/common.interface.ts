export interface ResponseErrorInterface {
  errors: {
    [fieldName: string]: string[];
  };
}
