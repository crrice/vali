declare const VBase: {
    boolean: ((o: ModProxy<any>) => ModProxy<boolean> & SelfMap<DeMod<boolean, {
        optional: (o: ModProxy<any>) => ModProxy<any>;
        custom: (o: ModProxy<any>) => (fn: (v: any) => boolean) => ModProxy<any>;
    }>>) & {
        m: {
            optional: (o: ModProxy<any>) => ModProxy<any>;
            custom: (o: ModProxy<any>) => (fn: (v: any) => boolean) => ModProxy<any>;
        };
    };
    string: ((o: ModProxy<any>) => ModProxy<string> & SelfMap<DeMod<string, {
        optional: (o: ModProxy<any>) => ModProxy<any>;
        custom: (o: ModProxy<any>) => (fn: (v: any) => boolean) => ModProxy<any>;
    } & {
        regex: (o: ModProxy<string>) => (rgx: RegExp) => ModProxy<string>;
        email: (o: ModProxy<string>) => ModProxy<string>;
        alphanumeric: (o: ModProxy<string>) => ModProxy<string>;
        base64: (o: ModProxy<string>) => ModProxy<string>;
        hex: (o: ModProxy<string>) => ModProxy<string>;
        minLen: (o: ModProxy<string>) => (min: number) => ModProxy<string>;
        maxLen: (o: ModProxy<string>) => (max: number) => ModProxy<string>;
        isLen: (o: ModProxy<string>) => (len: number) => ModProxy<string>;
    }>>) & {
        m: {
            regex: (o: ModProxy<string>) => (rgx: RegExp) => ModProxy<string>;
            email: (o: ModProxy<string>) => ModProxy<string>;
            alphanumeric: (o: ModProxy<string>) => ModProxy<string>;
            base64: (o: ModProxy<string>) => ModProxy<string>;
            hex: (o: ModProxy<string>) => ModProxy<string>;
            minLen: (o: ModProxy<string>) => (min: number) => ModProxy<string>;
            maxLen: (o: ModProxy<string>) => (max: number) => ModProxy<string>;
            isLen: (o: ModProxy<string>) => (len: number) => ModProxy<string>;
            optional: (o: ModProxy<any>) => ModProxy<any>;
            custom: (o: ModProxy<any>) => (fn: (v: any) => boolean) => ModProxy<any>;
        };
    };
    number: ((o: ModProxy<any>) => ModProxy<number> & SelfMap<DeMod<number, {
        optional: (o: ModProxy<any>) => ModProxy<any>;
        custom: (o: ModProxy<any>) => (fn: (v: any) => boolean) => ModProxy<any>;
    } & {
        integer: (o: ModProxy<number>) => ModProxy<number>;
        max: (o: ModProxy<number>) => (max: number) => ModProxy<number>;
        min: (o: ModProxy<number>) => (min: number) => ModProxy<number>;
        lt: (o: ModProxy<number>) => (max: number) => ModProxy<number>;
        gt: (o: ModProxy<number>) => (min: number) => ModProxy<number>;
        interval: (o: ModProxy<number>) => (range: string) => ModProxy<number>;
    }>>) & {
        m: {
            integer: (o: ModProxy<number>) => ModProxy<number>;
            max: (o: ModProxy<number>) => (max: number) => ModProxy<number>;
            min: (o: ModProxy<number>) => (min: number) => ModProxy<number>;
            lt: (o: ModProxy<number>) => (max: number) => ModProxy<number>;
            gt: (o: ModProxy<number>) => (min: number) => ModProxy<number>;
            interval: (o: ModProxy<number>) => (range: string) => ModProxy<number>;
            optional: (o: ModProxy<any>) => ModProxy<any>;
            custom: (o: ModProxy<any>) => (fn: (v: any) => boolean) => ModProxy<any>;
        };
    };
    literal: (o: ModProxy<any>) => (<T extends Primitive>(lit: T) => ModProxy<T> & SelfMap<DeMod<T, {
        optional: (o: ModProxy<any>) => ModProxy<any>;
        custom: (o: ModProxy<any>) => (fn: (v: any) => boolean) => ModProxy<any>;
    }>>) & {
        m: {
            optional: (o: ModProxy<any>) => ModProxy<any>;
            custom: (o: ModProxy<any>) => (fn: (v: any) => boolean) => ModProxy<any>;
        };
    };
    arrayOf: (o: ModProxy<any>) => (<T>(type: ModProxy<T>) => ModProxy<T[]> & SelfMap<DeMod<T[], {
        optional: (o: ModProxy<any>) => ModProxy<any>;
        custom: (o: ModProxy<any>) => (fn: (v: any) => boolean) => ModProxy<any>;
    } & {
        minLen: <T>(o: ModProxy<T[]>) => (min: number) => ModProxy<T[]>;
        maxLen: <T>(o: ModProxy<T[]>) => (max: number) => ModProxy<T[]>;
        isLen: <T>(o: ModProxy<T[]>) => (len: number) => ModProxy<T[]>;
    }>>) & {
        m: {
            minLen: <T>(o: ModProxy<T[]>) => (min: number) => ModProxy<T[]>;
            maxLen: <T>(o: ModProxy<T[]>) => (max: number) => ModProxy<T[]>;
            isLen: <T>(o: ModProxy<T[]>) => (len: number) => ModProxy<T[]>;
            optional: (o: ModProxy<any>) => ModProxy<any>;
            custom: (o: ModProxy<any>) => (fn: (v: any) => boolean) => ModProxy<any>;
        };
    };
    mapOf: (o: ModProxy<any>) => (<T>(type: ModProxy<T>) => ModProxy<{
        [K: string]: T;
    }> & SelfMap<DeMod<T, {
        optional: (o: ModProxy<any>) => ModProxy<any>;
        custom: (o: ModProxy<any>) => (fn: (v: any) => boolean) => ModProxy<any>;
    }>>) & {
        m: {
            optional: (o: ModProxy<any>) => ModProxy<any>;
            custom: (o: ModProxy<any>) => (fn: (v: any) => boolean) => ModProxy<any>;
        };
    };
    shape: (o: ModProxy<any>) => (<T>(shape: { [K in keyof T]: ModProxy<T[K]>; }) => ModProxy<T> & SelfMap<DeMod<T, {
        optional: (o: ModProxy<any>) => ModProxy<any>;
        custom: (o: ModProxy<any>) => (fn: (v: any) => boolean) => ModProxy<any>;
    } & {
        noextra: <T>(o: ModProxy<T>) => ModProxy<T>;
    }>>) & {
        m: {
            optional: (o: ModProxy<any>) => ModProxy<any>;
            custom: (o: ModProxy<any>) => (fn: (v: any) => boolean) => ModProxy<any>;
        };
    };
    oneOf: (o: ModProxy<any>) => (<T1, T2 = never, T3 = never, T4 = never, T5 = never>(types_0: ModProxy<T1>, types_1?: ModProxy<T2> | undefined, types_2?: ModProxy<T3> | undefined, types_3?: ModProxy<T4> | undefined, types_4?: ModProxy<T5> | undefined) => ModProxy<T1 | T2 | T3 | T4 | T5> & SelfMap<DeMod<T1 | T2 | T3 | T4 | T5, {
        optional: (o: ModProxy<any>) => ModProxy<any>;
        custom: (o: ModProxy<any>) => (fn: (v: any) => boolean) => ModProxy<any>;
    }>>) & {
        m: {
            optional: (o: ModProxy<any>) => ModProxy<any>;
            custom: (o: ModProxy<any>) => (fn: (v: any) => boolean) => ModProxy<any>;
        };
    };
    allOf: (o: ModProxy<any>) => (<T1, T2 = unknown, T3 = unknown, T4 = unknown, T5 = unknown>(types_0: ModProxy<T1>, types_1?: ModProxy<T2> | undefined, types_2?: ModProxy<T3> | undefined, types_3?: ModProxy<T4> | undefined, types_4?: ModProxy<T5> | undefined) => ModProxy<T1 & T2 & T3 & T4 & T5> & SelfMap<DeMod<T1 & T2 & T3 & T4 & T5, {
        optional: (o: ModProxy<any>) => ModProxy<any>;
        custom: (o: ModProxy<any>) => (fn: (v: any) => boolean) => ModProxy<any>;
    }>>) & {
        m: {
            optional: (o: ModProxy<any>) => ModProxy<any>;
            custom: (o: ModProxy<any>) => (fn: (v: any) => boolean) => ModProxy<any>;
        };
    };
    custom: (o: ModProxy<any>) => (<T = any>(fn: (v: unknown) => v is T) => ModProxy<T> & SelfMap<DeMod<T, {
        optional: (o: ModProxy<any>) => ModProxy<any>;
        custom: (o: ModProxy<any>) => (fn: (v: any) => boolean) => ModProxy<any>;
    }>>) & {
        m: {
            optional: (o: ModProxy<any>) => ModProxy<any>;
            custom: (o: ModProxy<any>) => (fn: (v: any) => boolean) => ModProxy<any>;
        };
    };
};
declare const V: {
    [K in keyof typeof VBase]: ReturnType<typeof VBase[K]>;
};
declare type ModProxy<T> = {
    (v: unknown): v is T;
    f: ((v: T) => boolean)[];
    e: Error[];
};
declare type ModSet<T> = {
    [mod_name: string]: ((o: ModProxy<T>) => ModProxy<T>) | ((o: ModProxy<T>) => (...args: any[]) => ModProxy<T>);
};
declare type DeMod<S, T extends ModSet<S>> = {
    [K in keyof T]: T[K] extends (o: ModProxy<any>) => ModProxy<S> ? ModProxy<S> : T[K] extends ((o: ModProxy<any>) => (...args: infer A) => ModProxy<S>) ? (...args: A) => ModProxy<S> : never;
};
declare type SelfMap<T> = {
    [K in keyof T]: T[K] extends ModProxy<any> ? T[K] & SelfMap<T> : T[K] extends (...args: infer A) => ModProxy<infer R> ? (...args: A) => ModProxy<R> & SelfMap<T> : never;
};
declare type Primitive = undefined | null | string | number | boolean | {};
export { V };
