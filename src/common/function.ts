export const getPaginationParams = (
  params: IPagination,
): { take?: number; skip?: number } => {
  const { page, pageSize } = params;

  return {
    ...(page && { skip: (page - 1) * pageSize }),
    ...(pageSize && { take: pageSize }),
  };
};
