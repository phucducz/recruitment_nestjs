export class BaseConverter {
  toCamelCase<T extends Record<string, any>>(obj: T) {
    return Object.keys(obj).reduce((acc, key) => {
      const newKey = key.replace(/_([a-z])/g, (_: any, letter: string) =>
        letter.toUpperCase(),
      );
      (acc as Record<string, any>)[newKey] = obj[key];

      return acc;
    }, {} as T);
  }
}
