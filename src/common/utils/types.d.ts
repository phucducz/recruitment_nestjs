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

interface IGenerateRelationshipOptional {
  hasPassword?: boolean;
  hasRelations?: boolean;
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

interface BaseQueries {
  page?: string;
  pageSize?: string;
}

interface IJobsQueries extends BaseQueries {
  title?: string;
  placementsId?: string;
  salaryMin?: string;
  salaryMax?: string;
  workTypesId?: string;
  categoriesId?: string;
  jobFieldsId?: string;
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
