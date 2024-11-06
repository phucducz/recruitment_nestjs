interface ICreate<T> {
  variable: T;
  createBy: number;
  transactionalEntityManager?: EntityManager;
}

interface ICreateMany<T> {
  variables: T[];
  createBy: number;
  transactionalEntityManager?: EntityManager;
}

interface IUpdate<T> {
  variable: T;
  updateBy: number;
  transactionalEntityManager?: EntityManager;
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

interface IDelete<T> {
  variable: T;
  transactionalEntityManager?: EntityManager;
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
