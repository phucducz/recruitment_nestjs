interface ICreate<T> {
  variable: T;
  createBy: number;
  transactionalEntityManager?: EntityManager;
}

interface ICreateMany<T> {
  variables: T[];
  createBy: number;
}

interface IUpdate<T> {
  variable: T;
  updateBy: number;
}

interface IUpdateMTM<T, QT> {
  variable: T;
  updateBy: number;
  queries: QT;
}

interface IUpdateMany<T> {
  variables: T[];
  updateBy: number;
}

interface APIResponse {
  message: string;
  statusCode: 200 | 401 | 400;
}

interface IGenerateRelationshipOptional<T = any> {
  hasPassword?: boolean;
  hasRelations?: boolean;
  relationships?: string[];
  select?: FindOptionsSelect<T>;
}

interface IPagination {
  page?: number;
  pageSize?: number;
}

interface IInitialMap {
  attemptCount: number;
  sendCount: number;
  lastSentAt: number;
}
