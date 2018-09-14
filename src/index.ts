
//--------------\\
// The V Object \\
//--------------\\

/*

Possible additions:

 - add null, undefined to primitives list?
 - add regex type
 - add custom string validators
   - is email
   - is zip code
   - etc.

 */

export const V = {
	get string() {
		return makeV(v => typeof v === "string");
	},
	get number() {
		return makeV(v => typeof v === "number");
	},
	get boolean() {
		return makeV(v => typeof v === "boolean");
	},

	literal(value: any) {
		return makeV(v => v === value);
	},
	arrayOf(type: VFunc) {
		return makeV(v => v instanceof Array && v.every(type));
	},

	oneOf(...types: VFunc[]) {
		return makeV(v => types.some(t => t(v)));
	},
	allOf(...types: VFunc[]) {
		return makeV(v => types.every(t => t(v)));
	},

	custom(func: VFunc) {
		return makeV(func);
	},

	shape(obj: {[k: string]: VFunc}) {
		const vfunc = (v: any): boolean => v
			&& typeof v === "object"
			&& Object.entries(obj).every(([k, vdr]) => k in v
				? vdr(v[k])
				: vdr["v_optional"])
			&& (vfunc["v_noextra"]
				? Object.keys(v).every(k => k in obj)
				: true);

		return makeV(vfunc);
	}
}

//----------------------------\\
// Modifier Addition Function \\
//----------------------------\\

function makeV(f: (v: any) => boolean): VT {
	return Object.defineProperties(f, {
		optional: {
			get: function() { f["v_optional"] = true; return f; }
		},
		noextra: {
			get: function() { f["v_noextra"] = true; return f; }
		},
	});
}

//-------\\
// Types \\
//-------\\

/*
TODO: See if we can get the types so that the V functions
act as type guards and can be used to turn an `unknown` into
any other type (that we support).

That would be fucking cool, like if we could do:

	declare const json: unknown;
	if (V.shape({foo: V.string})(json)) {
		// Where now `json` has type: `{foo: string}`.
		json.foo.startsWith("Sweet!");
	} else {
		throw new Error("Not valid!");
	}

 */

// Shorthand for writing this type over and over. This is the type of every
// value returned by `V.{whatever}` calls.
type VFunc = (v: any) => boolean;

// This type represents a validator function as returned from
// a `V.number`, or `V.<whatever>` call. It is just an `any -> bool`
// function that has additional modifiers.
//
// All (built in) modifers are idempotent. I make no guarantees for
// those you define yourself.
type VT = {
	(v: any): boolean;

	//--- Modifiers ---\\

	/*
	Note that all modifiers have a hidden value:
	'v_{modifier name}', which represents the
	actual value that the modifer accessor sets.

	Since I don't want that to be manually mutated
	or show up in my autocomplete, I've not listed them here.
	*/

	// This modifier only works if this validator is for an object field.
	// If set, the object is still valid if this field is missing.
	optional: VT;

	// This modifier only works if this validator is for an object (shape).
	// If set, the object is not valid if it contains keys other than what
	// is listed in the shape schema.
	noextra: VT;
}

