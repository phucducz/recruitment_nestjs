import dayjs from 'dayjs';
import { Between, Raw } from 'typeorm';

import { PaginationDto } from 'src/dto/pagination/pagination.dto';

export const getPaginationParams = (
  params: IPagination,
): { take?: number; skip?: number } => {
  const { page = 1, pageSize = 10 } = params;

  return {
    ...(page && { skip: (page - 1) * pageSize }),
    ...(pageSize && { take: pageSize }),
  };
};

export const rtPageInfoAndItems = (
  pagination: PaginationDto,
  result: [any[], number],
) => {
  const { page = 1, pageSize = 10 } = pagination;
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
): object => {
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

export const formatParams = <T extends object>(params: T): T => {
  const formatedParams = Object.entries(params).reduce(
    (prevVal, currentVal) => {
      const [key, value] = currentVal;

      if (value)
        prevVal[key] = typeof value === 'string' ? value?.trim() : value;

      return prevVal;
    },
    {} as T,
  );

  return formatedParams;
};

export const buildJsonFieldSearch = (options: {
  entityKey: string;
  jsonColumnName: string;
  filterGroups: Record<string, Record<string, any>> | any;
}) => {
  const { entityKey, jsonColumnName, filterGroups } = options;

  const condition: string[] = [];
  const parameters: Record<string, any> = {};

  const stringOperator = 'ILIKE';
  const numberOperator = '::int =';

  Object.entries(filterGroups).forEach((item) => {
    const [jsonKey, fields] = item;

    if (typeof fields === 'object')
      Object.entries(fields).forEach((val) => {
        const [key, value] = val;

        const paramKey = `${jsonKey}_${key}`;
        const isNumber = typeof value === 'number';

        if (value) {
          const expr = isNumber
            ? `("${jsonColumnName}"->'${jsonKey}'->>'${key}')::int ${numberOperator} :${paramKey}`
            : `"${jsonColumnName}"->'${jsonKey}'->>'${key}' ${stringOperator} :${paramKey}`;

          parameters[paramKey] = isNumber ? +value : `%${value}%`;
          condition.push(expr);
        }
      }, []);
    else if (fields) {
      const isNumber = typeof fields === 'number';
      const expr = isNumber
        ? `("${jsonColumnName}"->>'${jsonKey}') ${numberOperator} :${jsonKey}`
        : `"${jsonColumnName}"->>'${jsonKey}' ${stringOperator} :${jsonKey}`;

      parameters[jsonKey] = isNumber ? +fields : `%${fields}%`;
      condition.push(expr);
    }

    return { condition, parameters };
  });

  return condition.length && Object.keys(parameters).length
    ? {
        [entityKey]: Raw(() => condition?.join(' AND '), parameters),
      }
    : {};
};

export const buildDateRangeFilter = (
  field: string,
  date?: string | Date,
): Record<string, any> => {
  if (!date) return {};
  return {
    [field]: Between(
      dayjs(date).startOf('day').toDate(),
      dayjs(date).endOf('day').toDate(),
    ),
  };
};
