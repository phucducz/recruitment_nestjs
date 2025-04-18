export enum UNAUTHORIZED_EXCEPTION_MESSAGE {
  TOKEN_EXPIRED = 'Phiên đăng nhập đã hết hạn',
  REFRESH_TOKEN_EXPIRED = 'Refresh token đã hết hạn',
  NO_PROVIDED_TOKEN = 'Không có token nào được cung cấp',
  INVALID_TOKEN = 'Token không hợp lệ',
  INVALID_REFRESH_TOKEN = 'Refresh token không hợp lệ',
}

export enum FORBIDDEN_EXCEPTION_MESSAGE {
  MISSING_PERMISSION = 'Bạn không đủ quyền hạn để thực hiện thao tác này'
}

export enum FORGOT_PASSWORD_TOKEN_STATUS {
  VALID = 'valid',
  INVALID = 'invalid',
}

export enum ROLES {
  USER = 'user',
  ADMIN = 'admin',
  EMPLOYER = 'employer',
}

export enum JOB_STATUS {
  ACTIVE = 'Đang tuyển',
  INACTIVE = 'Ngừng đăng tin',
  DELETED = 'Đã xóa',
}

export enum START_AFTER_OFFER_DESIRED_JOB {
  AFTERTHRIDTYDAYS = 'Sau 30 ngày',
  NOW = 'Bắt đầu ngay',
  AFTERONEORTWOWEEK = '1-2 tuần',
  NOTIFYLATER = 'Sẽ thông báo khi có offer',
}

export enum APPLICANT_SOURCES {
  ADDED_BY_EMPLOYEE = 'Thêm bởi thành viên',
  APPLY = 'Ứng tuyển',
}

export enum STATUS_TITLES {
  JOB_ACTIVE = 'Đang tuyển',
  JOB_INACTIVE = 'Ngừng đăng tin',
  JOB_DELETED = 'Đã xóa',
  APPLICATION_EVALUATING = 'Đang đánh giá',
  APPLICATION_INTERVIEWING = 'Phỏng vấn',
  APPLICATION_RECRUITING = 'Đã tuyển',
  APPLICATION_OFFERING = 'Đang offer',
  APPLICATION_REJECTED = 'Đã từ chối',
  SCHEDULE_INTERVIEWING = 'Phỏng vấn',
  SCHEDULE_START_WORKING = 'Bắt đầu đi làm',
}

export enum STATUS_TYPE_TITLES {
  INTERVIEW = 'Phỏng vấn',
  JOB = 'Công việc',
  SCHEDULE = 'Lịch trình',
}

export enum STATUS_TYPE_CODES {
  JOB = 'job',
  ACCOUNT = 'account',
  SCHEDULE = 'schedule',
  INTERVIEW = 'interview',
}

export enum STATUS_CODE {
  ACCOUNT_ACTIVE = 'ACCOUNT_ACTIVE',
  ACCOUNT_INACTIVE = 'ACCOUNT_INACTIVE',
}

export enum ICON_TYPE {
  IMAGE = 'image',
  BUILT_IN = 'builtin',
}

export enum PERMISSION {
  VIEW_PROFILE = 'VIEW_PROFILE',
  EDIT_PROFILE = 'EDIT_PROFILE',
  VIEW_RESUME = 'VIEW_RESUME',
  UPDATE_RESUME = 'UPDATE_RESUME',
  VIEW_DESIRED_JOB = 'VIEW_DESIRED_JOB',
  EDIT_DESIRED_JOB = 'EDIT_DESIRED_JOB',
  VIEW_APPLIED_JOB = 'VIEW_APPLIED_JOB',
  VIEW_EMPLOYER_APPROACH = 'VIEW_EMPLOYER_APPROACH',
  VIEW_ACCOUNT = 'VIEW_ACCOUNT',
  UPDATE_ACCOUNT = 'UPDATE_ACCOUNT',
  VIEW_ADMIN_DASHBOARD = 'VIEW_ADMIN_DASHBOARD',
  VIEW_EMPLOYER_DASHBOARD = 'VIEW_EMPLOYER_DASHBOARD',
  VIEW_CANDIDATES = 'VIEW_CANDIDATES',
  POST_JOB = 'POST_JOB',
  VIEW_RECRUITMENT = 'VIEW_RECRUITMENT',
  USER_SIGN_IN = 'USER_SIGN_IN',
  USER_SIGN_UP = 'USER_SIGN_UP',
  EMPLOYER_SIGN_IN = 'EMPLOYER_SIGN_IN',
  EMPLOYER_SIGN_UP = 'EMPLOYER_SIGN_UP',
  LOGOUT = 'LOGOUT',
}
