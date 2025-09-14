declare const __brand: unique symbol;
export type Brand<B> = {
    readonly [__brand]: B;
};
export type Branded<T, B> = T & Brand<B>;
export type Constructor<T = any, Arguments extends unknown[] = any[]> = new (...args: Arguments) => T;
export type WrapperType<T> = T;
export {};
