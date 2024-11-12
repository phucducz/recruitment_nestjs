import { PaginationDto } from 'src/dto/pagination/pagination.dto';

export const getPaginationParams = (
  params: IPagination,
): { take?: number; skip?: number } => {
  const { page, pageSize } = params;

  return {
    ...(page && { skip: (page - 1) * pageSize }),
    ...(pageSize && { take: pageSize }),
  };
};

export const rtPageInfoAndItems = (
  pagination: PaginationDto,
  result: [any[], number],
) => {
  const { page, pageSize } = pagination;
  const [items, totalItems] = result;

  if (!page || !pageSize)
    return {
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        currentPage: 1,
        itemsPerPage: totalItems,
        totalItems,
        totalPages: 1,
      },
      items: items,
    };

  const totalPages = Math.ceil(totalItems / pageSize);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page !== 1;

  return {
    pageInfo: {
      hasNextPage,
      hasPreviousPage,
      currentPage: page,
      itemsPerPage: pageSize,
      totalItems,
      totalPages,
    },
    items: items,
  };
};

export const snakeToCamelCase = (fieldName: string) => {
  return fieldName.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

export const filterColumns = (
  columns: string[],
  removeColumns: string[],
): Object => {
  return columns.reduce((acc, field) => {
    if (removeColumns.includes(field)) acc[field] = false;
    else acc[field] = true;

    return acc;
  }, {});
};

export const filterUndefinedValues = <T extends object>(
  object: Partial<T>,
): Partial<T> => {
  return Object.keys(object).reduce((acc, key) => {
    if (object[key] !== undefined) acc[key] = object[key];
    return acc;
  }, {} as Partial<T>);
};

export const getItemsDiff = <T, ST extends Record<string, any>>(params: {
  items: {
    key?: string;
    data: T[];
  };
  storedItems: {
    key: string;
    data: ST[];
  };
}): { itemsToAdd: T[]; itemsToRemove: ST[]; itemToUpdate: T[] } => {
  const { items, storedItems } = params;

  const itemsToAdd = items.data.filter(
    (item) =>
      !storedItems.data.some(
        (storedItem) =>
          storedItem[storedItems.key] ===
          (!!items?.key ? item[items?.key] : item),
      ),
  );
  const itemsToRemove = storedItems.data.filter(
    (storedItem) =>
      !items.data.some(
        (item) =>
          (!!items?.key ? item[items?.key] : item) ===
          storedItem[storedItems.key],
      ),
  );
  const itemToUpdate = items.data.filter((item) =>
    storedItems.data.some(
      (storedItem) =>
        storedItem[storedItems.key] ===
        (!!items?.key ? item[items?.key] : item),
    ),
  );

  return { itemsToAdd, itemsToRemove, itemToUpdate };
};
