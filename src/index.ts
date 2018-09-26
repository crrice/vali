
//------------------\\
// Helper Functions \\
//------------------\\

function prox<T, M extends {}>(f: (v: unknown) => v is T, mods: M): ModProxy<T> & SelfMap<DeMod<T, M>> {
	const me: (v: unknown) => v is T = new Proxy(f as ModProxy<any>, {
		get: function (o, p) {
			return p in mods ? mods[p](me) : o[p];
		},
		apply: function(t, _, args) {
			t.e = [];
			return t.f.every(f => f(args[0]));
		},
	});

	// @ts-ignore: Can't find the 'f' field on 'me', but I know better than you typescript.
	return me;
}

function vErr(o: ModProxy<any>, msg: string): false {
	o.e.push(new Error(msg));
	return false;
}

//---------\\
// Globals \\
//---------\\

const GLOBAL_MODS = {
	optional: (o: ModProxy<any>) => (o["_optional"] = true, o) as OModProxy<any>,
	custom: (o: ModProxy<any>) => (fn: (v: any) => boolean) => (o.f.push(fn), o),
};

//---------\\
// Numbers \\
//---------\\

const NUMBER_MODS = {
	integer: (o: ModProxy<number>) => {
		const check = (v: number) => Number.isInteger(v) || vErr(o, `Number is not an integer.`);
		return (o.f.push(check), o);
	},

	max: (o: ModProxy<number>) => (max: number) => {
		const check = (v: number) => v <= max || vErr(o, `Number is larger than maximum of ${max}.`);
		return (o.f.push(check), o);
	},

	min: (o: ModProxy<number>) => (min: number) => {
		const check = (v: number) => v >= min || vErr(o, `Number is smaller than minimum of ${min}`);
		return (o.f.push(check), o);
	},

	lt: (o: ModProxy<number>) => (max: number) => {
		const check = (v: number) => v < max || vErr(o, `Number is not less than the upper limit of ${max}.`);
		return (o.f.push(check), o);
	},

	gt: (o: ModProxy<number>) => (min: number) => {
		const check = (v: number) => v > min || vErr(o, `Number is not greater than the lower limit of ${min}.`);
		return (o.f.push(check), o);
	},

	// As a mathematical interval (eg, "[0, 1)" style notation):
	interval: (o: ModProxy<number>) => (range: string) => {
		const rangeCheck = parseRange(range);
		const check = (v: number) => rangeCheck(v) || vErr(o, `Number is not within specified range of ${range}.`);
		return (o.f.push(check), o);
	}
}

//--- Number Helpers ---\\

function parseRange(range: string): (v: number) => boolean {
	const range_parse = range.match(/^([[(])\s*(.*?),\s*(.*?)\s*([\])])$/);
	if (!range_parse) throw new Error("Invalid range expression.");

	const range_vals = [+range_parse[2], +range_parse[3]];
	if (range_vals.some(n => Number.isNaN(n))) throw new Error("Invalid interval expression.");
	if (range_vals[0] > range_vals[1]) throw new Error("Invalid interval expression (interval defines the empty set).");

	return v => (range_parse[1] === "(" ? range_vals[0] < v : range_vals[0] <= v) &&
		        (range_parse[4] === ")" ? v < range_vals[1] : v <= range_vals[1]);
}

//---------\\
// Strings \\
//---------\\

const STRING_MODS = {
	regex: (o: ModProxy<string>) => (rgx: RegExp) => {
		const check = (v: string) => rgx.test(v) || vErr(o, "String did not pass the specified RegExp.");
		return (o.f.push(check), o);
	},

	email: (o: ModProxy<string>) => {
		const check = (v: string) => email_regex.test(v) || vErr(o, "String did not appear to be a valid email.");
		return (o.f.push(check), o);
	},

	alphanumeric: (o: ModProxy<string>) => {
		const check = (v: string) => alphanum_regex.test(v) || vErr(o, "String did not appear to be alphanumeric.");
		return (o.f.push(check), o);
	},

	base64: (o: ModProxy<string>) => {
		const check = (v: string) => base64_regex.test(v) || vErr(o, "String did not appear to be valid base64.");
		return (o.f.push(check), o);
	},

	hex: (o: ModProxy<string>) => {
		const check = (v: string) => hex_regex.test(v) || vErr(o, "String did not appear to be valid hex.");
		return (o.f.push(check), o);
	},

	minLen: (o: ModProxy<string>) => (min: number) => {
		const check = (v: string) => v.length >= min || vErr(o, "String length is smaller than the minimum.");
		return (o.f.push(check), o);
	},

	maxLen: (o: ModProxy<string>) => (max: number) => {
		const check = (v: string) => v.length <= max || vErr(o, "String length is larger than the maximum.");
		return (o.f.push(check), o);
	},

	isLen: (o: ModProxy<string>) => (len: number) => {
		const check = (v: string) => v.length === len || vErr(o, "String length is not equal to the specified length.");
		return (o.f.push(check), o);
	},
};

//--- String Helpers ---\\

const email_regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const alphanum_regex = /^[a-zA-Z0-9]*$/i;
const base64_regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
const hex_regex = /^([abcdef0-9]{2})*$/i;

//--------\\
// Arrays \\
//--------\\

const ARRAY_MODS = {
	minLen: <T>(o: ModProxy<T[]>) => (min: number) => {
		const check = (v: T[]) => v.length >= min || vErr(o, `Array length is smaller than the minimum of ${min}.`);
		return (o.f.push(check), o);
	},

	maxLen: <T>(o: ModProxy<T[]>) => (max: number) => {
		const check = (v: T[]) => v.length <= max || vErr(o, `Array length is larger than the maximum of ${max}.`);
		return (o.f.push(check), o);
	},

	isLen: <T>(o: ModProxy<T[]>) => (len: number) => {
		const check = (v: T[]) => v.length === len || vErr(o, `Array length is not equal to the specified length of ${len}.`);
		return (o.f.push(check), o);
	},
};

//--------\\
// Shapes \\
//--------\\

// Since the shape mod 'noextra' needs to know the shape spec to work, we can't have
// a predefined set of mods. We have to construct them dynamically so that each one
// can respond to the shape spec specifically.

const createShapeMods = (shape_spec: {[k: string]: ModProxy<any>}) => ({
	noextra: <T>(o: ModProxy<T>) => {
		const check = (v: T) => Object.keys(v).every(k => k in shape_spec || vErr(o, `Object does not allow additional keys, found unknown key: ${k}.`));
		return (o.f.push(check), o);
	},
});

//--------------\\
// The V Object \\
//--------------\\

const VBase = {
	boolean: Object.assign((o: ModProxy<any>) => {
		const check = (v: unknown) => typeof v === "boolean" || vErr(o, "Value is not a boolean.");
		return (o.f.push(check), o) as ModProxy<boolean> & SelfMap<DeMod<boolean, typeof GLOBAL_MODS>>;
	}, {m: {...GLOBAL_MODS}}),

	string: Object.assign((o: ModProxy<any>) => {
		const check = (v: unknown) => typeof v === "string" || vErr(o, "Value is not a string.");
		return (o.f.push(check), o) as ModProxy<string> & SelfMap<DeMod<string, typeof GLOBAL_MODS & typeof STRING_MODS>>;
	}, {m: {...GLOBAL_MODS, ...STRING_MODS}}),

	number: Object.assign((o: ModProxy<any>) => {
		const check = (v: unknown) => typeof v === "number" || vErr(o, "Value is not a number.");
		return (o.f.push(check), o) as ModProxy<number> & SelfMap<DeMod<number, typeof GLOBAL_MODS & typeof NUMBER_MODS>>;
	}, {m: {...GLOBAL_MODS, ...NUMBER_MODS}}),

	literal: (o: ModProxy<any>) => Object.assign(<T extends Primitive>(lit: T) => {
		const check = (v: unknown) => v === lit || vErr(o, `Value was not the specified literal: ${lit}.`);
		return (o.f.push(check), o) as ModProxy<T> & SelfMap<DeMod<T, typeof GLOBAL_MODS>>;
	}, {m: {...GLOBAL_MODS}}),

	arrayOf: (o: ModProxy<any>) => Object.assign(<T>(type: ModProxy<T>) => {
		const check = (v: unknown) => (v instanceof Array || vErr(o, "Value is not an array.")) && ((v as T[]).every(e => type(e)) || vErr(o, "Array items are not of correct type."));
		return (o.f.push(check), o) as ModProxy<T[]> & SelfMap<DeMod<T[], typeof GLOBAL_MODS & typeof ARRAY_MODS>>;
	}, {m: {...GLOBAL_MODS, ...ARRAY_MODS}}),

	mapOf: (o: ModProxy<any>) => Object.assign(<T>(type: ModProxy<T>) => {
		const check = (v: unknown) => (v && typeof v === "object" || vErr(o, "Value is not an object.")) && (Object.values(v as any).every(e => type(e)) || vErr(o, "Object has (at least) one value of incorrect type."));
		return (o.f.push(check), o) as ModProxy<{[K: string]: T}> & SelfMap<DeMod<T, typeof GLOBAL_MODS>>
	}, {m: {...GLOBAL_MODS}}),

	shape: (o: ModProxy<any>) => Object.assign(<T extends {[K: string]: OModProxy<any>|RModProxy<any>}>(shape: T) => {
		const check = (v: unknown) => v && typeof v === "object" && Object.entries(shape).every(([k, mp]: any) => (k in (v as any) ? mp((v as any)[k]) : mp["_optional"]) || vErr(o, `Value was not of correct shape, key "${k}" is ${k in (v as any) ? "invalid" : "missing"}`));
		return (o.f.push(check), o["m"] = {...o["m"], ...createShapeMods(shape)}, o) as ModProxy<DeOpt<T>> & SelfMap<DeMod<DeOpt<T>, typeof GLOBAL_MODS & ReturnType<typeof createShapeMods>>>
	}, {m: {...GLOBAL_MODS}}), // fuck..., No access to shape spec at this phase...

	// Forgive me father, for I have sinned. These function signatures are demonic.

	oneOf: (o: ModProxy<any>) => Object.assign(<T1, T2 = never, T3 = never, T4 = never, T5 = never>(...types: [ModProxy<T1>, ModProxy<T2>?, ModProxy<T3>?, ModProxy<T4>?, ModProxy<T5>?]) => {
		const check = (v: unknown) => types.some(fn => fn!(v)) || vErr(o, "Value was none of the specified types.");
		return (o.f.push(check), o) as ModProxy<T1 | T2 | T3 | T4 | T5> & SelfMap<DeMod<T1 | T2 | T3 | T4 | T5, typeof GLOBAL_MODS>>;
	}, {m: {...GLOBAL_MODS}}),

	allOf: (o: ModProxy<any>) => Object.assign(<T1, T2 = unknown, T3 = unknown, T4 = unknown, T5 = unknown>(...types: [ModProxy<T1>, ModProxy<T2>?, ModProxy<T3>?, ModProxy<T4>?, ModProxy<T5>?]) => {
		const check = (v: unknown) => types.every(fn => fn!(v)) || vErr(o, "Value was not (at least) one of the specified types.");
		return (o.f.push(check), o) as ModProxy<T1 & T2 & T3 & T4 & T5> & SelfMap<DeMod<T1 & T2 & T3 & T4 & T5, typeof GLOBAL_MODS>>
	}, {m: {...GLOBAL_MODS}}),

	// And finally, the custom validator, for your convenience.

	custom: (o: ModProxy<any>) => Object.assign(<T = any>(fn: (v: unknown) => v is T) => {
		const check = (v: unknown) => fn(v) || vErr(o, "Value failed a custom type check.");
		return (o.f.push(check), o) as ModProxy<T> & SelfMap<DeMod<T, typeof GLOBAL_MODS>>;
	}, {m: {...GLOBAL_MODS}}),
}

const V: {[K in keyof typeof VBase]: ReturnType<typeof VBase[K]>} = new Proxy(VBase as any, {
	get: function(vobj, prop) {
		if (!(prop in vobj)) return undefined;

		const o = Object.assign(() => {}, {f: [], e: []});
		const vdr = vobj[prop](o);

		return "m" in vobj[prop]
			? prox(vdr, vobj[prop].m)
			: (...args: any[]) => prox(vdr(...args), vdr["m"]);
	},
	set: function(vobj, prop, val) {
		if (prop !== "m") return false;
		return (vobj[prop] = val, true);
	},
});

//-------\\
// Types \\
//-------\\

type Omit<T, K extends string|number|Symbol> = Pick<T, Exclude<keyof T, K>>;

type OModProxy<T> = ModProxy<T> & {_optional: true};
type RModProxy<T> = ModProxy<T> & {_optional?: never};

type ModProxy<T> = {
	(v: unknown): v is T;
	f: ((v: T) => boolean)[];
	e: Error[];
}

type ModSet<T> = {
	[mod_name: string]:
		((o: ModProxy<T>) => ModProxy<T>) |
		((o: ModProxy<T>) => (...args: any[]) => ModProxy<T>);
}

type DeMod<S, T extends ModSet<S>> = {
	[K in keyof T]:
		T[K] extends (o: ModProxy<any>) => OModProxy<S>
		? OModProxy<S>
		: T[K] extends ((o: ModProxy<any>) => (...args: infer A) => ModProxy<S>)
		? (...args: A) => OModProxy<S>
		: T[K] extends (o: ModProxy<any>) => ModProxy<S>
		? ModProxy<S>
		: T[K] extends ((o: ModProxy<any>) => (...args: infer A) => ModProxy<S>)
		? (...args: A) => ModProxy<S>
		: never;
}

type SelfMap<T> = {
	[K in keyof T]:
		T[K] extends ModProxy<any>
		? T[K] & SelfMap<T>
		: T[K] extends (...args: infer A) => OModProxy<infer R>
		? (...args: A) => OModProxy<R> & SelfMap<T>
		: T[K] extends (...args: infer A) => ModProxy<infer R>
		? (...args: A) => ModProxy<R> & SelfMap<T>
		: never;
}

// This is required to force the 'literal' validator to infer literal types.
type Primitive = undefined | null | string | number | boolean | {};

type DeOpt<T extends {[K: string]: OModProxy<any>|RModProxy<any>}> = {
	[K in OnlyOptKeys<T>]?: T[K] extends OModProxy<infer R> ? R : never;
} & {
	[K in OnlyReqKeys<T>]: T[K] extends RModProxy<infer R> ? R : never;
}

type OnlyOptKeys<T extends {[K: string]: OModProxy<any>|RModProxy<any>}> = {
	[K in keyof T]: T[K] extends OModProxy<any> ? K : never;
}[keyof T];

type OnlyReqKeys<T extends {[K: string]: OModProxy<any>|RModProxy<any>}> = {
	[K in keyof T]: T[K] extends RModProxy<any> ? K : never;
}[keyof T];

//---------\\
// Exports \\
//---------\\

export { V };

const val = V.shape({foo: V.string.optional, bar: V.number});

const thing: unknown = "";
if (val(thing)) {
	thing.foo
	thing.bar
}

