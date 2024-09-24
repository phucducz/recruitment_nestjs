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

interface IUpdate<T> {
  variable: T;
  updateBy: number;
}

interface IUpdateMany<T> {
  variables: T[];
  updateBy: number;
}

interface IPagination {
  page?: number;
  pageSize?: number;
}
