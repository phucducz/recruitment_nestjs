interface BaseQueries extends IPagination {}

interface IJobQueries extends BaseQueries {
  title?: string;
  placementsId?: string;
  salaryMin?: string;
  salaryMax?: string;
  workTypesId?: string;
  categoriesId?: string;
  jobFieldsId?: string;
  usersId?: string;
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

interface IAppliedJobQueries extends BaseQueries {
  usersId?: number;
}

interface IFindApplicantsQueries extends BaseQueries {
  usersId?: number;
  jobTitle?: string;
  applicantName?: string;
  source?: string;
  applyDate?: string;
}

interface IFindDesiredJobQueries extends BaseQueries {
  
}