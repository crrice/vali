declare const V: {
    readonly boolean: RecursiveModdedGuard<boolean, {
        readonly optional: Guard<any> & {
            getErrors(): string[];
        } & {
            __optional: true;
        };
        readonly noextra: Guard<any> & {
            getErrors(): string[];
        } & {
            __noextra: true;
        };
    }>;
    readonly number: RecursiveModdedGuard<number, {
        readonly integer: EGuard<number>;
        readonly max: (max: number) => EGuard<number>;
        readonly lt: (max: number) => EGuard<number>;
        readonly min: (min: number) => EGuard<number>;
        readonly gt: (min: number) => EGuard<number>;
        readonly interval: (interval: string) => EGuard<number>;
    } & {
        readonly optional: Guard<any> & {
            getErrors(): string[];
        } & {
            __optional: true;
        };
        readonly noextra: Guard<any> & {
            getErrors(): string[];
        } & {
            __noextra: true;
        };
    }>;
    readonly string: RecursiveModdedGuard<string, {
        readonly regex: (regex: RegExp) => EGuard<string>;
        readonly email: EGuard<string>;
        readonly alphanumeric: EGuard<string>;
        readonly base64: EGuard<string>;
        readonly hex: EGuard<string>;
        readonly minLen: (min: number) => EGuard<string>;
        readonly maxLen: (max: number) => EGuard<string>;
        readonly isLen: (len: number) => EGuard<string>;
    } & {
        readonly optional: Guard<any> & {
            getErrors(): string[];
        } & {
            __optional: true;
        };
        readonly noextra: Guard<any> & {
            getErrors(): string[];
        } & {
            __noextra: true;
        };
    }>;
    readonly literal: <T extends Primitive>(lit: T) => RecursiveModdedGuard<T, {
        readonly optional: Guard<any> & {
            getErrors(): string[];
        } & {
            __optional: true;
        };
        readonly noextra: Guard<any> & {
            getErrors(): string[];
        } & {
            __noextra: true;
        };
    }>;
    readonly arrayOf: <T>(type: EGuard<T>) => RecursiveModdedGuard<T[], {
        readonly minLen: (min: number) => EGuard<any[]>;
        readonly maxLen: (max: number) => EGuard<any[]>;
        readonly isLen: (len: number) => EGuard<any[]>;
    } & {
        readonly optional: Guard<any> & {
            getErrors(): string[];
        } & {
            __optional: true;
        };
        readonly noextra: Guard<any> & {
            getErrors(): string[];
        } & {
            __noextra: true;
        };
    }>;
    readonly mapOf: <T>(type: EGuard<T>) => RecursiveModdedGuard<{
        [K: string]: T;
    }, {
        readonly optional: Guard<any> & {
            getErrors(): string[];
        } & {
            __optional: true;
        };
        readonly noextra: Guard<any> & {
            getErrors(): string[];
        } & {
            __noextra: true;
        };
    }>;
    readonly shape: <T extends ShapeForm>(spec: T) => RecursiveModdedGuard<UnOptFlag<T>, {
        readonly optional: Guard<any> & {
            getErrors(): string[];
        } & {
            __optional: true;
        };
        readonly noextra: Guard<any> & {
            getErrors(): string[];
        } & {
            __noextra: true;
        };
    }>;
    readonly oneOf: <T1, T2 = never, T3 = never, T4 = never, T5 = never>(types_0: EGuard<T1>, types_1?: EGuard<T2> | undefined, types_2?: EGuard<T3> | undefined, types_3?: EGuard<T4> | undefined, types_4?: EGuard<T5> | undefined) => RecursiveModdedGuard<T1 | T2 | T3 | T4 | T5, {
        readonly optional: Guard<any> & {
            getErrors(): string[];
        } & {
            __optional: true;
        };
        readonly noextra: Guard<any> & {
            getErrors(): string[];
        } & {
            __noextra: true;
        };
    }>;
    readonly allOf: <T1, T2 = unknown, T3 = unknown, T4 = unknown, T5 = unknown>(types_0: EGuard<T1>, types_1?: EGuard<T2> | undefined, types_2?: EGuard<T3> | undefined, types_3?: EGuard<T4> | undefined, types_4?: EGuard<T5> | undefined) => RecursiveModdedGuard<T1 & T2 & T3 & T4 & T5, {
        readonly optional: Guard<any> & {
            getErrors(): string[];
        } & {
            __optional: true;
        };
        readonly noextra: Guard<any> & {
            getErrors(): string[];
        } & {
            __noextra: true;
        };
    }>;
    readonly custom: <T>(type: Guard<T>) => RecursiveModdedGuard<T, {
        readonly optional: Guard<any> & {
            getErrors(): string[];
        } & {
            __optional: true;
        };
        readonly noextra: Guard<any> & {
            getErrors(): string[];
        } & {
            __noextra: true;
        };
    }>;
};
declare type Primitive = undefined | null | string | number | boolean | {};
declare type Guard<T> = (v: unknown) => v is T;
declare type EGuard<T> = Guard<T> & {
    getErrors(): string[];
};
declare type RecursiveModdedGuard<T, M> = EGuard<T> & {
    [K in keyof M]: M[K] extends (...args: infer A) => EGuard<any> ? (...args: A) => RecursiveModdedGuard<T, OptForward<M[K], M>> & OptJust<M[K]> : RecursiveModdedGuard<T, OptForward<M[K], M>> & OptJust<M[K]>;
};
declare type ShapeForm = {
    [K: string]: Flagged<Guard<any>, "__optional">;
};
declare type FOpt = {
    __optional: true;
};
declare type MapOpt<T> = {
    [K in keyof T]: T[K] & FOpt;
};
declare type OptForward<P, T> = P extends FOpt ? MapOpt<T> : T;
declare type OptJust<P> = P extends FOpt ? FOpt : unknown;
declare type Flagged<T, F extends string> = (T & {
    [X in F]: true;
}) | (T & {
    [X in F]?: never;
});
declare type UnFlag<F extends string, M extends Flagged<any, F>, M1, M2> = M extends {
    [X in F]: true;
} ? M1 : M2;
declare type UnFlagL<F extends string, M extends Flagged<any, F>, M1> = UnFlag<F, M, never, M1>;
declare type UnFlagR<F extends string, M extends Flagged<any, F>, M1> = UnFlag<F, M, M1, never>;
declare type UnFlagLK<T extends {
    [K: string]: Flagged<any, "__optional">;
}> = {
    [K in keyof T]: UnFlagL<"__optional", T[K], K>;
}[keyof T];
declare type UnFlagRK<T extends {
    [K: string]: Flagged<any, "__optional">;
}> = {
    [K in keyof T]: UnFlagR<"__optional", T[K], K>;
}[keyof T];
declare type UnOptFlag<T extends {
    [K: string]: Flagged<Guard<any>, "__optional">;
}> = {
    [K in UnFlagLK<T>]: T[K] extends Guard<infer U> ? UnFlagL<"__optional", T[K], U> : never;
} & {
    [K in UnFlagRK<T>]?: T[K] extends Guard<infer U> ? UnFlagR<"__optional", T[K], U> : never;
};
export { V };
export default V;
