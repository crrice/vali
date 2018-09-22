
//------------------\\
// Helper Functions \\
//------------------\\

function prox<T>(f: (v: unknown) => v is T, mods: {}): ModProxy<T> {
	const me: (v: unknown) => v is T = new Proxy(Object.assign(f, {f: [] as any[]}), {
		get: function (o, p) {
			return p in mods ? mods[p](me) : o[p];
		},
		apply: function(t, _, args) {
			return t(args[0]) && t.f.every(f => f(args[0]));
		},
	});

	// @ts-ignore: Can't find the 'f' field on 'me', but I know better than you typescript.
	return me;
}

function mod(f: (..._: any[]) => (v: any) => boolean): (o: ModProxy<any>) => (..._: any[]) => ModProxy<any> {
	return o => (...args: any[]) => (o.f.push(f(...args)), o);
}

//--------------\\
// The V Object \\
//--------------\\

const V = {

	//--- Primitives + Literals ---\\

	get boolean() {
		return prox(function(v: unknown): v is boolean { return typeof v === "boolean"; }, Object.assign({},
			GLOBAL_MODS,
			// No boolean mods, they're so simple that I can't think of anything useful for em.
		));
	},
	get number() {
		return prox(function(v: unknown): v is number { return typeof v === "number"; }, Object.assign({},
			GLOBAL_MODS,
			NUMBER_MODS
		));
	},
	get string() {
		return prox(function(v: unknown): v is string { return typeof v === "string"; }, Object.assign({},
			GLOBAL_MODS,
			STRING_MODS,
		));
	},

	literal<T extends Primitive>(lit: T) {
		return prox(function(v: unknown): v is T { return v === lit; }, Object.assign({},
			GLOBAL_MODS,
		));
	},

	//--- Objects + Arrays ---\\

	arrayOf<T>(type: ModProxy<T>) {
		return prox(function(v: unknown): v is T[] { return v instanceof Array && v.every(e => type(e)); }, Object.assign({},
			GLOBAL_MODS,
			ARRAY_MODS,
		));
	},

	mapOf<T>(type: ModProxy<T>) {
		return prox(function(v: unknown): v is StringMap<T> { return v && typeof v === "object" && Object.values(v).every(e => type(e)); }, Object.assign({},
			GLOBAL_MODS,
		));
	},

	shape<T extends {}>(shape_spec: {[K in keyof T]: ModProxy<T[K]> }) {
		// This is a more complex one so I will define the function separately (imagine this on one line, lol)...
		function isShape(v: unknown): v is T {
			if (!v || typeof v !== "object") return false;
			return Object.entries(shape_spec).every(([k, mpx]: any) => k in (v as any) ? mpx((v as any)[k]) : mpx["_optional"]);
		}

		return prox(isShape, Object.assign({},
			GLOBAL_MODS,
			createShapeMods(shape_spec),
		));
	},

	//--- Utilities ---\\

	// Defined elsewhere due to necessity of overload signatures...
	oneOf: oneOf,
	allOf: allOf,
}

//--- Utilities ---\\

// These functions must be defined out here since I need to attach overloads to them.
// The overloads go up to five arugments but if use-cases for more are common it's trivial
// to add more up to whatever number of arguments (but we gotta stop somewhere...)
//
// However, we cannot currently give a good type for an arbitrary number of arguments.
// Typescript: variadic types when?! Typescript plz!
// See: https://github.com/Microsoft/TypeScript/issues/5453

function oneOf<T1>(type1: ModProxy<T1>): ModProxy<T1>;
function oneOf<T1, T2>(type1: ModProxy<T1>, type2: ModProxy<T2>): ModProxy<T1 | T2>;
function oneOf<T1, T2, T3>(type1: ModProxy<T1>, type2: ModProxy<T2>, type3: ModProxy<T3>): ModProxy<T1 | T2 | T3>
function oneOf<T1, T2, T3, T4>(type1: ModProxy<T1>, type2: ModProxy<T2>, type3: ModProxy<T3>, type4: ModProxy<T4>): ModProxy<T1 | T2 | T3 | T4>;
function oneOf<T1, T2, T3, T4, T5>(type1: ModProxy<T1>, type2: ModProxy<T2>, type3: ModProxy<T3>, type4: ModProxy<T4>, type5: ModProxy<T5>): ModProxy<T1 | T2 | T3 | T4 | T5>;
function oneOf(...args: ModProxy<any>[]): ModProxy<any>;
function oneOf(...args: ModProxy<any>[]): ModProxy<any> {
	return prox(function (v): v is any { return args.some(mpx => mpx(v)) }, Object.assign({},
		GLOBAL_MODS,
	));
}

function allOf<T1>(type1: ModProxy<T1>): ModProxy<T1>;
function allOf<T1, T2>(type1: ModProxy<T1>, type2: ModProxy<T2>): ModProxy<T1 & T2>;
function allOf<T1, T2, T3>(type1: ModProxy<T1>, type2: ModProxy<T2>, type3: ModProxy<T3>): ModProxy<T1 & T2 & T3>
function allOf<T1, T2, T3, T4>(type1: ModProxy<T1>, type2: ModProxy<T2>, type3: ModProxy<T3>, type4: ModProxy<T4>): ModProxy<T1 & T2 & T3 & T4>;
function allOf<T1, T2, T3, T4, T5>(type1: ModProxy<T1>, type2: ModProxy<T2>, type3: ModProxy<T3>, type4: ModProxy<T4>, type5: ModProxy<T5>): ModProxy<T1 & T2 & T3 & T4 & T5>;
function allOf(...args: ModProxy<any>[]): ModProxy<any>;
function allOf(...args: ModProxy<any>[]): ModProxy<any> {
	return prox(function (v): v is any { return args.every(mpx => mpx(v)) }, Object.assign({},
		GLOBAL_MODS,
	));
}

const GLOBAL_MODS: ModSet<any> = {
	optional: o => (o["_optional"] = true, o),

	// Custom validator:
	custom: mod((fn: (v: unknown) => boolean) => v => fn(v)),
};

//---------\\
// Numbers \\
//---------\\

const NUMBER_MODS: ModSet<number> = {
	// Is specific number type:
	integer(o) { o.f.push(v => Number.isInteger(v)); return o; },

	// Comparison mods:
	max: mod((max: number) => v => v <= max),
	lt: mod((max: number) => v => v < max),
	min: mod((min: number) => v => v >= min),
	gt: mod((min: number) => v => v > min),

	// As a mathematical interval (eg, "[0, 1)" style notation):
	interval: mod((range: string) => {
		const range_parse = range.match(/^([[(])\s*(.*?),\s*(.*?)\s*([\])])$/);
		if (!range_parse) throw new Error("Invalid range expression.");

		const range_vals = [+range_parse[2], +range_parse[3]];
		if (range_vals.some(n => Number.isNaN(n))) throw new Error("Invalid range expression.");
		if (range_vals[0] > range_vals[1]) throw new Error("Invalid range expression (range is empty).");

		return v => (range_parse[1] === "(" ? range_vals[0] < v : range_vals[0] <= v) &&
		            (range_parse[4] === ")" ? v < range_vals[1] : v <= range_vals[1]);
	}),
}

//---------\\
// Strings \\
//---------\\

const STRING_MODS: ModSet<string> = {
	regex: mod((rgx: RegExp) => v => rgx.test(v)),

	email: o => (o.f.push(v => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v)), o),
	alphanumeric: o => (o.f.push(v => /^[a-zA-Z0-9]*$/.test(v)), o),
	base64: o => (o.f.push(v => /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(v)), o),
	hex: o => (o.f.push(v => /^([abcdef0-9]{2})*$/.test(v)), o),

	minLength: mod((len: number) => v => v.length >= len),
	maxLength: mod((len: number) => v => v.length <= len),
};

//--------\\
// Arrays \\
//--------\\

const ARRAY_MODS: ModSet<any[]> = {
	minLength: mod((len: number) => v => v.length >= len),
	maxLength: mod((len: number) => v => v.length <= len),
};

//--------\\
// Shapes \\
//--------\\

// Since the shape mod 'noextra' needs to know the shape spec to work, we can't have
// a predefined set of mods. We have to construct them dynamically so that each one
// can respond to the shape spec specifically.

function createShapeMods(shape_spec: {[k: string]: ModProxy<any>}): ModSet<any> {
	return {
		noextra(o) { o.f.push(v => Object.keys(v).every(k => k in shape_spec)); return o; },
	};
}

//-------\\
// Types \\
//-------\\

type ModProxy<T> = {
	(v: unknown): v is T;
	f: ((v: T) => boolean)[];
}

type ModSet<T> = {
	[mod_name: string]:
		((o: ModProxy<T>) => ModProxy<T>) |
		((o: ModProxy<T>) => () => ModProxy<T>);
}

type Primitive = undefined | null | string | number | boolean | {};
type StringMap<T> = {[k: string]: T};

//---------\\
// Exports \\
//---------\\

export { V };
