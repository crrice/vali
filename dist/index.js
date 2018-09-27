"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function prox(f, mods) {
    const me = new Proxy(f, {
        get: function (o, p) {
            return p in mods ? mods[p](me) : o[p];
        },
        apply: function (t, _, args) {
            t.e = [];
            return t.f.every(f => f(args[0]));
        },
    });
    return me;
}
function vErr(o, msg) {
    o.e.push(new Error(msg));
    return false;
}
const GLOBAL_MODS = {
    optional: (o) => (o["_optional"] = true, o),
    custom: (o) => (fn) => (o.f.push(fn), o),
};
const NUMBER_MODS = {
    integer: (o) => {
        const check = (v) => Number.isInteger(v) || vErr(o, `Number is not an integer.`);
        return (o.f.push(check), o);
    },
    max: (o) => (max) => {
        const check = (v) => v <= max || vErr(o, `Number is larger than maximum of ${max}.`);
        return (o.f.push(check), o);
    },
    min: (o) => (min) => {
        const check = (v) => v >= min || vErr(o, `Number is smaller than minimum of ${min}`);
        return (o.f.push(check), o);
    },
    lt: (o) => (max) => {
        const check = (v) => v < max || vErr(o, `Number is not less than the upper limit of ${max}.`);
        return (o.f.push(check), o);
    },
    gt: (o) => (min) => {
        const check = (v) => v > min || vErr(o, `Number is not greater than the lower limit of ${min}.`);
        return (o.f.push(check), o);
    },
    interval: (o) => (range) => {
        const rangeCheck = parseRange(range);
        const check = (v) => rangeCheck(v) || vErr(o, `Number is not within specified range of ${range}.`);
        return (o.f.push(check), o);
    }
};
function parseRange(range) {
    const range_parse = range.match(/^([[(])\s*(.*?),\s*(.*?)\s*([\])])$/);
    if (!range_parse)
        throw new Error("Invalid range expression.");
    const range_vals = [+range_parse[2], +range_parse[3]];
    if (range_vals.some(n => Number.isNaN(n)))
        throw new Error("Invalid interval expression.");
    if (range_vals[0] > range_vals[1])
        throw new Error("Invalid interval expression (interval defines the empty set).");
    return v => (range_parse[1] === "(" ? range_vals[0] < v : range_vals[0] <= v) &&
        (range_parse[4] === ")" ? v < range_vals[1] : v <= range_vals[1]);
}
const STRING_MODS = {
    regex: (o) => (rgx) => {
        const check = (v) => rgx.test(v) || vErr(o, "String did not pass the specified RegExp.");
        return (o.f.push(check), o);
    },
    email: (o) => {
        const check = (v) => email_regex.test(v) || vErr(o, "String did not appear to be a valid email.");
        return (o.f.push(check), o);
    },
    alphanumeric: (o) => {
        const check = (v) => alphanum_regex.test(v) || vErr(o, "String did not appear to be alphanumeric.");
        return (o.f.push(check), o);
    },
    base64: (o) => {
        const check = (v) => base64_regex.test(v) || vErr(o, "String did not appear to be valid base64.");
        return (o.f.push(check), o);
    },
    hex: (o) => {
        const check = (v) => hex_regex.test(v) || vErr(o, "String did not appear to be valid hex.");
        return (o.f.push(check), o);
    },
    minLen: (o) => (min) => {
        const check = (v) => v.length >= min || vErr(o, "String length is smaller than the minimum.");
        return (o.f.push(check), o);
    },
    maxLen: (o) => (max) => {
        const check = (v) => v.length <= max || vErr(o, "String length is larger than the maximum.");
        return (o.f.push(check), o);
    },
    isLen: (o) => (len) => {
        const check = (v) => v.length === len || vErr(o, "String length is not equal to the specified length.");
        return (o.f.push(check), o);
    },
};
const email_regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const alphanum_regex = /^[a-zA-Z0-9]*$/i;
const base64_regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
const hex_regex = /^([abcdef0-9]{2})*$/i;
const ARRAY_MODS = {
    minLen: (o) => (min) => {
        const check = (v) => v.length >= min || vErr(o, `Array length is smaller than the minimum of ${min}.`);
        return (o.f.push(check), o);
    },
    maxLen: (o) => (max) => {
        const check = (v) => v.length <= max || vErr(o, `Array length is larger than the maximum of ${max}.`);
        return (o.f.push(check), o);
    },
    isLen: (o) => (len) => {
        const check = (v) => v.length === len || vErr(o, `Array length is not equal to the specified length of ${len}.`);
        return (o.f.push(check), o);
    },
};
const createShapeMods = (shape_spec) => ({
    noextra: (o) => {
        const check = (v) => Object.keys(v).every(k => k in shape_spec || vErr(o, `Object does not allow additional keys, found unknown key: ${k}.`));
        return (o.f.push(check), o);
    },
});
const VBase = {
    boolean: Object.assign((o) => {
        const check = (v) => typeof v === "boolean" || vErr(o, "Value is not a boolean.");
        return (o.f.push(check), o);
    }, { m: Object.assign({}, GLOBAL_MODS) }),
    string: Object.assign((o) => {
        const check = (v) => typeof v === "string" || vErr(o, "Value is not a string.");
        return (o.f.push(check), o);
    }, { m: Object.assign({}, GLOBAL_MODS, STRING_MODS) }),
    number: Object.assign((o) => {
        const check = (v) => typeof v === "number" || vErr(o, "Value is not a number.");
        return (o.f.push(check), o);
    }, { m: Object.assign({}, GLOBAL_MODS, NUMBER_MODS) }),
    literal: (o) => Object.assign((lit) => {
        const check = (v) => v === lit || vErr(o, `Value was not the specified literal: ${lit}.`);
        return (o.f.push(check), o);
    }, { m: Object.assign({}, GLOBAL_MODS) }),
    arrayOf: (o) => Object.assign((type) => {
        const check = (v) => (v instanceof Array || vErr(o, "Value is not an array.")) && (v.every(e => type(e)) || vErr(o, "Array items are not of correct type."));
        return (o.f.push(check), o);
    }, { m: Object.assign({}, GLOBAL_MODS, ARRAY_MODS) }),
    mapOf: (o) => Object.assign((type) => {
        const check = (v) => (v && typeof v === "object" || vErr(o, "Value is not an object.")) && (Object.values(v).every(e => type(e)) || vErr(o, "Object has (at least) one value of incorrect type."));
        return (o.f.push(check), o);
    }, { m: Object.assign({}, GLOBAL_MODS) }),
    shape: (o) => Object.assign((() => {
        const me = (shape) => {
            const check = (v) => v && typeof v === "object" && Object.entries(shape).every(([k, mp]) => (k in v ? mp(v[k]) : mp["_optional"]) || vErr(o, `Value was not of correct shape, key "${k}" is ${k in v ? "invalid" : "missing"}`));
            return (o.f.push(check), me["m"] = Object.assign({}, me["m"], createShapeMods(shape)), o);
        };
        return me;
    })(), { m: Object.assign({}, GLOBAL_MODS) }),
    oneOf: (o) => Object.assign((...types) => {
        const check = (v) => types.some(fn => fn(v)) || vErr(o, "Value was none of the specified types.");
        return (o.f.push(check), o);
    }, { m: Object.assign({}, GLOBAL_MODS) }),
    allOf: (o) => Object.assign((...types) => {
        const check = (v) => types.every(fn => fn(v)) || vErr(o, "Value was not (at least) one of the specified types.");
        return (o.f.push(check), o);
    }, { m: Object.assign({}, GLOBAL_MODS) }),
    custom: (o) => Object.assign((fn) => {
        const check = (v) => fn(v) || vErr(o, "Value failed a custom type check.");
        return (o.f.push(check), o);
    }, { m: Object.assign({}, GLOBAL_MODS) }),
};
const V = new Proxy(VBase, {
    get: function (vobj, prop) {
        if (!(prop in vobj))
            return undefined;
        const o = Object.assign(() => { }, { f: [], e: [] });
        const vdr = vobj[prop](o);
        return "m" in vobj[prop]
            ? prox(vdr, vobj[prop].m)
            : (...args) => prox(vdr(...args), vdr["m"]);
    },
    set: function (vobj, prop, val) {
        if (prop !== "m")
            return false;
        return (vobj[prop] = val, true);
    },
});
exports.V = V;
