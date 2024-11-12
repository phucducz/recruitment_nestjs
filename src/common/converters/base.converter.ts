type CamelCase<S extends string> = S extends `${infer T}_${infer U}`
  ? `${T}${Capitalize<CamelCase<U>>}`
  : S;

export class BaseConverter {
  toCamelCase<T extends Record<string, any>>(
    obj: T,
  ): { [K in keyof T as CamelCase<K & string>]: T[K] } {
    return Object.keys(obj).reduce(
      (acc, key) => {
        const newKey = key.replace(/_([a-z])/g, (_: any, letter: string) =>
          letter.toUpperCase(),
        ) as CamelCase<typeof key>;
        (acc as Record<string, any>)[newKey] = obj[key];
        return acc;
      },
      {} as { [K in keyof T as CamelCase<K & string>]: T[K] },
    );
  }
}
