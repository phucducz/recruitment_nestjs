interface APIResponse {
  message: string;
  statusCode: 200 | 401 | 400;
}

// type ICreateWorkType = CreateWorkTypeDto &
//   Pick<User, 'id' | 'email' | 'fullName'>;

interface ICreate<T> {
  variable: T;
  createBy: number;
}

type ICreateMany<T> = {
  variables: T[];
  createBy: number;
};
