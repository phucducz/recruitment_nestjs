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

type TSalaryCurrency = 'vnd' | 'usd';

interface IPagination {
  page?: number;
  pageSize?: number;
}

interface IPaginationQuery {
  page?: string;
  pageSize?: string;
}

interface BaseQueries extends IPaginationQuery {}

interface IJobQueries extends BaseQueries {
  title?: string;
  placementsId?: string;
  salaryMin?: string;
  salaryMax?: string;
  workTypesId?: string;
  categoriesId?: string;
  jobFieldsId?: string;
}

interface ISkillQueries extends BaseQueries {
  title?: string;
}

interface IForeignLanguageQueries extends BaseQueries {
  title?: string;
}

interface IUserQueries extends BaseQueries {
  jobFieldsId?: string;
  jobPositionsId?: string;
}

interface IInitialMap {
  attemptCount: number;
  sendCount: number;
  lastSentAt: number;
}

interface IPendingVerification extends IInitialMap {
  token: string;
}

interface IOTP extends IInitialMap {
  otp: number;
  expiresAt: number;
}

interface IForgotPassword extends IPendingVerification {}
