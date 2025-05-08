type BaseQueries = IPagination;

interface IJobQueries extends BaseQueries {
  title?: string;
  placementIds?: string;
  salaryMin?: string;
  salaryMax?: string;
  workTypesId?: string;
  categoriesId?: string;
  jobFieldsId?: string;
  usersId?: string;
  statusId?: string;
  jobsId?: string;
  type?: 'less' | 'more';
}

interface ISkillQueries extends BaseQueries {
  title?: string;
}

interface IForeignLanguageQueries extends BaseQueries {
  title?: string;
}

interface IUserQueries extends BaseQueries {
  id: string;
  email?: string;
  roleId?: number;
  statusId?: number;
  jobFieldsId?: string;
  createdDate?: string;
  jobPositionsId?: string;
}

interface IAppliedJobQueries extends BaseQueries {
  usersId?: number;
}

interface IFindApplicantsQueries extends BaseQueries {
  usersId?: number;
  jobsId?: string;
  applicantName?: string;
  source?: string;
  applyDate?: string;
  statusId?: string;
  type?: 'default' | 'new';
}

interface IFindDesiredJobsQueries extends BaseQueries {
  id?: number;
  jobFieldsId?: string;
  totalYearExperience?: string;
  placementsId?: string;
}

interface IFindAchivementQueries extends BaseQueries {
  id?: string;
}

interface IFindWorkExperiencesQueries extends BaseQueries {
  id?: string;
  usersId?: string;
}

interface IFindUserSkillsQueries extends BaseQueries {
  skillsId?: string;
  usersId?: string;
}

interface IFindUserForeignLanguagesQueries extends BaseQueries {
  foreignLanguagesId?: string | number;
  usersId?: string | number;
}

interface IFindApplicationStatusQueries extends BaseQueries {
  statusId: string;
}

interface IFIndJobsForEmployerQueries extends BaseQueries {
  title?: string;
  statusId?: string;
}

interface IFindApplicantDetailQueries {
  usersId: string;
  jobsId: string;
}

interface IFindStatusQueries extends BaseQueries {
  type?: string;
}

interface IFindInterviewSchedules extends BaseQueries {
  usersId: string;
  jobsId: string;
}

interface IFindUpcomingScheduleQueries extends BaseQueries {
  type: 'interviewing' | 'start_working';
}

interface IFindRoleQueries extends BaseQueries {
  id?: string;
  title?: string;
  createdDate?: string;
  functionalIds: number[];
}

interface FunctionalGroupQueries extends BaseQueries {
  id?: string;
  title?: string;
  createdDate?: string;
  type?: 'default' | 'all';
  functionalIds?: number[];
}

interface FunctionalQueries extends BaseQueries {
  id?: string;
  title?: string;
  code?: string;
  rolesId: string;
  type?: string;
  createdDate?: string;
}

interface RolesFunctionalQueries extends BaseQueries {
  id?: string;
}

interface MenuViewQueries extends BaseQueries {
  title?: string;
  path?: string;
  orderIndex?: number;
  iconType?: string;
  type: 'default' | 'combobox';
  createdDate?: string;
}

interface MenuViewGroupQueries extends BaseQueries {
  title?: string;
  orderIndex?: number;
  createdDate?: string;
  menuViewIds?: number[];
}

interface DesiredJobQueries {
  id?: number;
}