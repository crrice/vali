export declare const V: {
    readonly string: VT;
    readonly number: VT;
    readonly boolean: VT;
    literal(value: any): VT;
    arrayOf(type: VFunc): VT;
    oneOf(...types: VFunc[]): VT;
    allOf(...types: VFunc[]): VT;
    custom(func: VFunc): VT;
    shape(obj: {
        [k: string]: VFunc;
    }): VT;
};
declare type VFunc = (v: any) => boolean;
declare type VT = {
    (v: any): boolean;
    optional: VT;
    noextra: VT;
};
export {};
