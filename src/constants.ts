export const snakeToCamelCase = (fieldName: string) =>
  fieldName.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
