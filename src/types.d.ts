interface APIResponse {
  message: string;
  statusCode: 200 | 401 | 400;
}

interface ICreate<T> {
  variable: T;
  createBy: number;
}

interface ICreateMany<T> {
  variables: T[];
  createBy: number;
}

interface IPagination {
  take?: number;
  skip?: number;
}
