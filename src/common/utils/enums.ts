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
