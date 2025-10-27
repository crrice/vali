
//--- Helper Functions ---\\

function assignDescriptors<T, S1>(target: T, source1: S1): T & S1;
function assignDescriptors<T, S1, S2>(target: T, source1: S1, source2: S2): T & S1 & S2;
function assignDescriptors(target: any, ...sources: any[]): any;
function assignDescriptors(target: any, ...sources: any[]): any {
	return (sources.forEach(source => {
		Object.defineProperties(target, Object.keys(source).reduce((descriptors, key) => {
			descriptors[key] = Object.getOwnPropertyDescriptor(source, key);
			return descriptors;
		}, {}));
	}), target);
}

// Note, by the time this runs, the `__e` prop has already been assigned to the parent.
// So if you want changes made to it to be visible, you must mutate, not re-assign.
function extendGuard<T>(guard: EGuard<T>, ex: (v: T) => boolean, em: string): Guard<T> {
	return (v): v is T => guard(v) && (ex(v) || (guard["__e"].push(em), false));
}

//--

function parseRange(range: string): (v: number) => boolean {
	const range_parse = range.match(/^([[(])\s*(.*?),\s*(.*?)\s*([\])])$/);
	if (!range_parse) throw new Error("Invalid range expression.");

	const range_vals = [toNum(range_parse[2]), toNum(range_parse[3])];
	if (range_vals.some(n => Number.isNaN(n))) throw new Error("Invalid interval expression.");
	if (range_vals[0] > range_vals[1]) throw new Error("Invalid interval expression (interval defines the empty set).");

	return v => (range_parse[1] === "(" ? range_vals[0] < v : range_vals[0] <= v) &&
		        (range_parse[4] === ")" ? v < range_vals[1] : v <= range_vals[1]);
}

// We use this to convert strings to numbers with support for common mathematical constants.
function toNum(s: string): number {
	if (["π", "Math.PI"].includes(s)) return Math.PI;
	if (["e", "Math.E"].includes(s)) return Math.E;
	if (["√2", "√(2)", "Math.SQRT2"].includes(s)) return Math.SQRT2;
	if (["√1/2", "√(1/2)", "Math.SQRT1_2"].includes(s)) return Math.SQRT1_2;
	if (["ln2", "ln(2)", "Math.LN2"].includes(s)) return Math.LN2;
	if (["ln10", "ln(10)", "Math.LN10"].includes(s)) return Math.LN10;
	if (["log2e", "log2(e)", "Math.LOG2E"].includes(s)) return Math.LOG2E;
	if (["log10e", "log10(e)", "Math.LOG10E"].includes(s)) return Math.LOG10E;
	if (["∞"].includes(s)) return Infinity;
	if (["-∞"].includes(s)) return -Infinity;
	return +s;
}

const email_regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const alphanum_regex = /^[a-z0-9]*$/i;
const base64_regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
const hex_regex = /^([0-9a-f]{2})*$/i;
const uuid_regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

//--- Mod Sets ---\\

const global_mods = {

	get optional(this: EGuard<any> & {__optional: true}) {
		return (this.__optional = true, this);
	},

	// TODO: move this to be a 'shape mod', it does not apply globally like optional does...
	get noextra(this: EGuard<any> & {__noextra: true}) {
		return (this.__noextra = true, this);
	},
};

const number_mods = {

	get integer(this: EGuard<number>) {
		return assignDescriptors(extendGuard(this, n => Number.isInteger(n), "Number is not an integer."), this);
	},

	get max(this: EGuard<number>) {
		return (max: number) => assignDescriptors(extendGuard(this, n => n <= max, `Value is larger than maximum of ${max}.`), this);
	},

	get lt(this: EGuard<number>) {
		return (max: number) => assignDescriptors(extendGuard(this, n => n < max, `Value is not smaller than upper limit of ${max}.`), this);
	},

	get min(this: EGuard<number>) {
		return (min: number) => assignDescriptors(extendGuard(this, n => n >= min, `Value is smaller than minimum of ${min}.`), this);
	},

	get gt(this: EGuard<number>) {
		return (min: number) => assignDescriptors(extendGuard(this, n => n > min, `Value is not larger than lower limit of ${min}.`), this);
	},

	get interval(this: EGuard<number>) {
		return (interval: string) => assignDescriptors(extendGuard(this, parseRange(interval), `Value is not within specified interval of ${interval}.`), this);
	},
};

const string_mods = {

	get regex(this: EGuard<string>) {
		return (regex: RegExp) => assignDescriptors(extendGuard(this, s => regex.test(s), `Value failed to pass regex: ${regex}.`), this);
	},

	get email(this: EGuard<string>) {
		return assignDescriptors(extendGuard(this, s => email_regex.test(s), `Value is not a valid email address.`), this);
	},

	get alphanumeric(this: EGuard<string>) {
		return assignDescriptors(extendGuard(this, s => alphanum_regex.test(s), "Value is not an alphanumeric string."), this);
	},

	get base64(this: EGuard<string>) {
		return assignDescriptors(extendGuard(this, s => base64_regex.test(s), "Value is not a valid base64 string."), this);
	},

	get hex(this: EGuard<string>) {
		return assignDescriptors(extendGuard(this, s => hex_regex.test(s), "Value is not a valid hex string."), this);
	},

	get uuid(this: EGuard<string>) {
		return assignDescriptors(extendGuard(this, s => uuid_regex.test(s), "Value is not a valid UUID string."), this);
	},

	get minLen(this: EGuard<string>) {
		return (min: number) => assignDescriptors(extendGuard(this, s => s.length >= min, `Value is shorter than minimum length of ${min}.`), this);
	},

	get maxLen(this: EGuard<string>) {
		return (max: number) => assignDescriptors(extendGuard(this, s => s.length <= max, `Value is longer than maximum length of ${max}`), this);
	},

	get isLen(this: EGuard<string>) {
		return (len: number) => assignDescriptors(extendGuard(this, s => s.length === len, `Value is not the specified length of ${len}.`), this);
	},
};

const array_mods = {

	get minLen(this: EGuard<any[]>) {
		return (min: number) => assignDescriptors(extendGuard(this, s => s.length >= min, `Value is shorter than minimum length of ${min}.`), this);
	},

	get maxLen(this: EGuard<any[]>) {
		return (max: number) => assignDescriptors(extendGuard(this, s => s.length <= max, `Value is longer than maximum length of ${max}`), this);
	},

	get isLen(this: EGuard<any[]>) {
		return (len: number) => assignDescriptors(extendGuard(this, s => s.length === len, `Value is not the specified length of ${len}.`), this);
	},
};

// const shape_mods = {

// };

//--- The V Object ---\\

// Note, properly getting the types for this involves overriding what typescript thinks it
// is (because you're wrong, typescript), mostly since we make liberal use of javascript's
// unique `this` semantics, which typescript (understandably) finds difficult to track.
//
// Moreover, the 'shape' function is by far the most complex one here, and it irritates me.
// But I don't know of any cleaner way for it to accomplish its job, so...
// The thing is like a 500 character single line function. SMH.

const V = {

	get boolean(): RecursiveModdedGuard<boolean, typeof global_mods> {
		const guard = Object.assign((v: unknown): v is boolean => (guard.__e.splice(0, guard.__e.length), false) || typeof v === "boolean" || (guard.__e.push("Value is not a boolean"), false), {__e: [] as string[], getErrors: () => guard.__e});
		return assignDescriptors(guard, global_mods) as any;
	},

	get number(): RecursiveModdedGuard<number, typeof number_mods & typeof global_mods> {
		const guard = Object.assign((v: unknown): v is number => (guard.__e.splice(0, guard.__e.length), false) || typeof v === "number" || (guard.__e.push("Value is not a number."), false), {__e: [] as string[], getErrors: () => guard.__e});
		return assignDescriptors(guard, number_mods, global_mods) as any;
	},

	get string(): RecursiveModdedGuard<string, typeof string_mods & typeof global_mods> {
		const guard = Object.assign((v: unknown): v is string => (guard.__e.splice(0, guard.__e.length), false) || typeof v === "string" || (guard.__e.push("Value is not a string."), false), {__e: [] as string[], getErrors: () => guard.__e});
		return assignDescriptors(guard, string_mods, global_mods) as any;
	},

	get literal(): <T extends Primitive>(lit: T) => RecursiveModdedGuard<T, typeof global_mods> {
		return <T extends Primitive>(lit: T) => {
			const guard = Object.assign((v: unknown): v is T => (guard.__e.splice(0, guard.__e.length), false) || v === lit || (guard.__e.push(`Value is not the specified literal ${typeof lit}, instead got: ${lit}.`), false), {__e: [] as string[], getErrors: () => guard.__e});
			return assignDescriptors(guard, global_mods) as any;
		};
	},

	get arrayOf(): <T>(type: EGuard<T>) => RecursiveModdedGuard<T[], typeof array_mods & typeof global_mods> {
		return <T>(type: EGuard<T>) => {
			const guard = Object.assign((v: unknown): v is T[] => (guard.__e.splice(0, guard.__e.length), false) || (v instanceof Array || (guard.__e.push(`Value is not an array.`), false)) && ((v as any[]).every(e => type(e) || (guard.__e.push("Array items are not of the correct type.", ...type["__e"]), false))), {__e: [] as string[], getErrors: () => guard.__e});
			return assignDescriptors(guard, array_mods, global_mods) as any;
		};
	},

	get mapOf(): <T>(type: EGuard<T>) => RecursiveModdedGuard<{[K: string]: T}, typeof global_mods> {
		return <T>(type: EGuard<T>) => {
			const guard = Object.assign((v: unknown): v is {[K: string]: T} => (guard.__e.splice(0, guard.__e.length), false) || (v && typeof v === "object" || (guard.__e.push("Value is not an object"), false)) && (Object.values(v as any).every(e => type(e) || (guard.__e.push("Map entries are not of the correct type", ...type["__e"]), false))), {__e: [] as string[], getErrors: () => guard.__e});
			return assignDescriptors(guard, global_mods) as any;
		}
	},

	get shape(): <T extends ShapeForm>(spec: T) => RecursiveModdedGuard<UnOptFlag<T>, typeof global_mods> {
		return <T extends ShapeForm>(spec: T) => {
			const guard = Object.assign((v: any): v is T => (guard.__e.splice(0, guard.__e.length), false) || (v && typeof v === "object" || (guard.__e.push("Value is not an object."), false)) && Object.entries(spec).every(([k, gd]: any) => (k in v ? gd(v[k]) : gd["__optional"]) || (guard.__e.push(`Value is not of correct shape. Key '${k}' is ${k in v ? "invalid" : "missing"}.`, ...gd.__e), false)) && (guard["__noextra"] ? Object.keys(v).every(k => k in spec || (guard.__e.push(`Value is not of correct shape. Contains unknown key '${k}', and extra keys are not allowed.`), false)) : true), {__e: [] as string[], getErrors: () => guard.__e});
			return assignDescriptors(guard, global_mods) as any;
		};
	},

	get oneOf(): <T1, T2 = never, T3 = never, T4 = never, T5 = never>(...types: [EGuard<T1>, EGuard<T2>?, EGuard<T3>?, EGuard<T4>?, EGuard<T5>?]) => RecursiveModdedGuard<T1 | T2 | T3 | T4 | T5, typeof global_mods> {
		return <T1, T2 = never, T3 = never, T4 = never, T5 = never>(...types: [EGuard<T1>, EGuard<T2>?, EGuard<T3>?, EGuard<T4>?, EGuard<T5>?]) => {
			const guard = Object.assign((v: unknown): v is T1 | T2 | T3 | T4 | T5 => (guard.__e.splice(0, guard.__e.length), false) || types.some(type => type!(v)) || (guard.__e.push("Value is none of the specified types.", ...([] as string[]).concat(...types.map(type => type!["__e"]))), false), {__e: [] as string[], getErrors: () => guard.__e});
			return assignDescriptors(guard, global_mods) as any;
		};
	},

	get allOf(): <T1, T2 = unknown, T3 = unknown, T4 = unknown, T5 = unknown>(...types: [EGuard<T1>, EGuard<T2>?, EGuard<T3>?, EGuard<T4>?, EGuard<T5>?]) => RecursiveModdedGuard<T1 & T2 & T3 & T4 & T5, typeof global_mods> {
		return <T1, T2 = unknown, T3 = unknown, T4 = unknown, T5 = unknown>(...types: [EGuard<T1>, EGuard<T2>?, EGuard<T3>?, EGuard<T4>?, EGuard<T5>?]) => {
			const guard = Object.assign((v: unknown): v is T1 & T2 & T3 & T4 & T5 => (guard.__e.splice(0, guard.__e.length), false) || types.every(type => type!(v) || (guard.__e.push("Value is not one of the specified types.", ...type!["__e"]), false)), {__e: [] as string[], getErrors: () => guard.__e});
			return assignDescriptors(guard, global_mods) as any;
		};
	},

	get custom(): <T>(type: Guard<T>) => RecursiveModdedGuard<T, typeof global_mods> {
		return <T>(type: Guard<T>) => {
			const guard = Object.assign((v: unknown): v is T => (guard.__e.splice(0, guard.__e.length), false) || type(v) || (guard.__e.push("Value failed the custom type check."), false), {__e: [] as string[], getErrors: () => guard.__e});
			return assignDescriptors(guard, global_mods) as any;
		};
	},
};

//--- Types ---\\

type Primitive = undefined | null | string | number | boolean | {};

type Guard<T> = (v: unknown) => v is T;

// Note that along with the public "getErrors" method, an EGuard also
// has a hidden "__e" property which getErrors returns. That property
// should be accessed only by this package, since it is very picky about
// how it is mutated / assigned.

type EGuard<T> = Guard<T> & {getErrors(): string[]};

// This type is pretty terrible. It's big and hard to follow, but since typescript can't infer
// the way we use a very polymorphic this, we need to tell it manually how the modifiers work.
// Namely, modifiers are recursive, and should forward info about prior ones (such as optional),
// so we write this type to automatically apply the type to it's own keys recursivly, and forward
// the optional flag to items further down the chain when found.

type RecursiveModdedGuard<T, M> = EGuard<T> & {
	[K in keyof M]: M[K] extends (...args: infer A) => EGuard<any>
		? (...args: A) => RecursiveModdedGuard<T, OptForward<M[K], M>> & OptJust<M[K]>
		: RecursiveModdedGuard<T, OptForward<M[K], M>> & OptJust<M[K]>;
}

type ShapeForm = {
	[K: string]: Flagged<Guard<any>, "__optional">;
}

//--- Conveinence ---\\

type FOpt = {__optional: true};
type MapOpt<T> = {
	[K in keyof T]: T[K] & FOpt;
}

type OptForward<P, T> = P extends FOpt ? MapOpt<T> : T;
type OptJust<P> = P extends FOpt ? FOpt : unknown;

//--- Fancy Type Algebra ---\\

// I wish I didn't have to do this crazyness. Surely there's a way to simplify this as
// well, but I don't know what right now. So, for now, this stays, for better or worse.

type Flagged<T, F extends string> = (T & { [X in F]: true }) | (T & { [X in F]?: never; });
type UnFlag<F extends string, M extends Flagged<any, F>, M1, M2> = M extends {[X in F]: true} ? M1 : M2;

type UnFlagL<F extends string, M extends Flagged<any, F>, M1> = UnFlag<F, M, never, M1>;
type UnFlagR<F extends string, M extends Flagged<any, F>, M1> = UnFlag<F, M, M1, never>;

type UnFlagLK<T extends {[K: string]: Flagged<any, "__optional">}> = {
	[K in keyof T]: UnFlagL<"__optional", T[K], K>;
}[keyof T];

type UnFlagRK<T extends {[K: string]: Flagged<any, "__optional">}> = {
	[K in keyof T]: UnFlagR<"__optional", T[K], K>;
}[keyof T];

type UnOptFlag<T extends {[K: string]: Flagged<Guard<any>, "__optional">}> = {
	[K in UnFlagLK<T>]: T[K] extends Guard<infer U> ? UnFlagL<"__optional", T[K], U> : never;
} & {
	[K in UnFlagRK<T>]?: T[K] extends Guard<infer U> ? UnFlagR<"__optional", T[K], U>: never;
}

//--- Exports ---\\

export { V };
export default V;
