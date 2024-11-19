export enum UNAUTHORIZED_EXCEPTION_MESSAGE {
  TOKEN_EXPIRED = 'Phiên đăng nhập đã hết hạn',
  REFRESH_TOKEN_EXPIRED = 'Refresh token đã hết hạn',
  NO_PROVIDED_TOKEN = 'Không có token nào được cung cấp',
  INVALID_TOKEN = 'Token không hợp lệ',
  INVALID_REFRESH_TOKEN = 'Refresh token không hợp lệ',
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
