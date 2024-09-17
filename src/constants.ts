export const snakeToCamelCase = (fieldName: string) =>
  fieldName.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

export const userKeys = [
  'id',
  'createBy',
  'createAt',
  'updateBy',
  'updateAt',
  'fullName',
  'phoneNumber',
  'email',
  'password',
  'avatarUrl',
  'companyName',
  'companyUrl',
  'isActive',
];
