import { PaginationDto } from 'src/dto/pagination/pagination.dto';

export const getPaginationParams = ({
  page = 1,
  pageSize = 10,
}: IPagination): { take?: number; skip?: number } => {
  return {
    ...(page && { skip: (page - 1) * pageSize }),
    ...(pageSize && { take: pageSize }),
  };
};

export const rtPageInfoAndItems = (
  { page = 1, pageSize = 10 }: PaginationDto,
  result: [any[], number],
) => {
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
