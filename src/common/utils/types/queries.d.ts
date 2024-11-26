interface BaseQueries extends IPagination {}

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
  jobFieldsId?: string;
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
