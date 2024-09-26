export enum UNAUTHORIZED_EXCEPTION_MESSAGE {
    TOKEN_EXPIRED = 'Phiên đăng nhập đã hết hạn',
    REFRESH_TOKEN_EXPIRED = 'Refresh token đã hết hạn',
    NO_PROVIDED_TOKEN = 'Không có token nào được cung cấp',
    INVALID_TOKEN = 'Token không hợp lệ',
    INVALID_REFRESH_TOKEN = 'Refresh token không hợp lệ',
}