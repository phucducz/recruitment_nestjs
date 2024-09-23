import 'reflect-metadata';

export const Field = (): PropertyDecorator => {
  return (target: Object, propertyKey: string | symbol) => {
    const fields =
      Reflect.getMetadata(
        `fields_${target.constructor.name}`,
        target.constructor.prototype,
      ) || [];
    fields.push(propertyKey);
    Reflect.defineMetadata(
      `fields_${target.constructor.name}`,
      fields,
      target.constructor.prototype,
    );
  };
};
