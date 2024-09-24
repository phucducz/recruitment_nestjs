import { PaginationDto } from 'src/dto/pagination/pagination.dto';
import { BaseEntity } from 'src/entities/base.entity';
import { MANY_TO_MANY_ENTITIES } from './constants';

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

export const getEntityFields = (entity: typeof BaseEntity | any): string[] => {
  const entityFields =
    Reflect.getMetadata(`fields_${entity.name}`, entity.prototype) || [];

  if (MANY_TO_MANY_ENTITIES.includes(entity.name)) return entityFields;

  const baseFields =
    Reflect.getMetadata('fields_BaseEntity', BaseEntity.prototype) || [];

  return [...new Set([...baseFields, ...entityFields])];
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
