"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function assignDescriptors(target, ...sources) {
    return (sources.forEach(source => {
        Object.defineProperties(target, Object.keys(source).reduce((descriptors, key) => {
            descriptors[key] = Object.getOwnPropertyDescriptor(source, key);
            return descriptors;
        }, {}));
    }), target);
}
function extendGuard(guard, ex, em) {
    return (v) => guard(v) && (ex(v) || (guard.__e.push(em), false));
}
function parseRange(range) {
    const range_parse = range.match(/^([[(])\s*(.*?),\s*(.*?)\s*([\])])$/);
    if (!range_parse)
        throw new Error("Invalid range expression.");
    const range_vals = [toNum(range_parse[2]), toNum(range_parse[3])];
    if (range_vals.some(n => Number.isNaN(n)))
        throw new Error("Invalid interval expression.");
    if (range_vals[0] > range_vals[1])
        throw new Error("Invalid interval expression (interval defines the empty set).");
    return v => (range_parse[1] === "(" ? range_vals[0] < v : range_vals[0] <= v) &&
        (range_parse[4] === ")" ? v < range_vals[1] : v <= range_vals[1]);
}
function toNum(s) {
    if (["π", "Math.PI"].includes(s))
        return Math.PI;
    if (["e", "Math.E"].includes(s))
        return Math.E;
    if (["√2", "√(2)", "Math.SQRT2"].includes(s))
        return Math.SQRT2;
    if (["√1/2", "√(1/2)", "Math.SQRT1_2"].includes(s))
        return Math.SQRT1_2;
    if (["ln2", "ln(2)", "Math.LN2"].includes(s))
        return Math.LN2;
    if (["ln10", "ln(10)", "Math.LN10"].includes(s))
        return Math.LN10;
    if (["log2e", "log2(e)", "Math.LOG2E"].includes(s))
        return Math.LOG2E;
    if (["log10e", "log10(e)", "Math.LOG10E"].includes(s))
        return Math.LOG10E;
    if (["∞"].includes(s))
        return Infinity;
    if (["-∞"].includes(s))
        return -Infinity;
    return +s;
}
const email_regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const alphanum_regex = /^[a-zA-Z0-9]*$/i;
const base64_regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
const hex_regex = /^([abcdef0-9]{2})*$/i;
const global_mods = {
    get optional() {
        return (this.__optional = true, this);
    },
    get noextra() {
        return (this.__noextra = true, this);
    },
};
const number_mods = {
    get integer() {
        return assignDescriptors(extendGuard(this, n => Number.isInteger(n), "Number is not an integer."), this);
    },
    get max() {
        return (max) => assignDescriptors(extendGuard(this, n => n <= max, `Value is larger than maximum of ${max}.`), this);
    },
    get lt() {
        return (max) => assignDescriptors(extendGuard(this, n => n < max, `Value is not smaller than upper limit of ${max}.`), this);
    },
    get min() {
        return (min) => assignDescriptors(extendGuard(this, n => n >= min, `Value is smaller than minimum of ${min}.`), this);
    },
    get gt() {
        return (min) => assignDescriptors(extendGuard(this, n => n > min, `Value is not larger than lower limit of ${min}.`), this);
    },
    get interval() {
        return (interval) => assignDescriptors(extendGuard(this, parseRange(interval), `Value is not within specified interval of ${interval}.`), this);
    },
};
const string_mods = {
    get regex() {
        return (regex) => assignDescriptors(extendGuard(this, s => regex.test(s), `Value failed to pass regex: ${regex}.`), this);
    },
    get email() {
        return assignDescriptors(extendGuard(this, s => email_regex.test(s), `Value is not a valid email address.`), this);
    },
    get alphanumeric() {
        return assignDescriptors(extendGuard(this, s => alphanum_regex.test(s), "Value is not an alphanumeric string."), this);
    },
    get base64() {
        return assignDescriptors(extendGuard(this, s => base64_regex.test(s), "Value is not a valid base64 string."), this);
    },
    get hex() {
        return assignDescriptors(extendGuard(this, s => hex_regex.test(s), "Value is not a valid hex string."), this);
    },
    get minLen() {
        return (min) => assignDescriptors(extendGuard(this, s => s.length >= min, `Value is shorter than minimum length of ${min}.`), this);
    },
    get maxLen() {
        return (max) => assignDescriptors(extendGuard(this, s => s.length <= max, `Value is longer than maximum length of ${max}`), this);
    },
    get isLen() {
        return (len) => assignDescriptors(extendGuard(this, s => s.length === len, `Value is not the specified length of ${len}.`), this);
    },
};
const array_mods = {
    get minLen() {
        return (min) => assignDescriptors(extendGuard(this, s => s.length >= min, `Value is shorter than minimum length of ${min}.`), this);
    },
    get maxLen() {
        return (max) => assignDescriptors(extendGuard(this, s => s.length <= max, `Value is longer than maximum length of ${max}`), this);
    },
    get isLen() {
        return (len) => assignDescriptors(extendGuard(this, s => s.length === len, `Value is not the specified length of ${len}.`), this);
    },
};
const V = {
    get boolean() {
        const guard = Object.assign((v) => typeof v === "boolean" || (guard.__e.push("Value is not a boolean"), false), { __e: [] });
        return assignDescriptors(guard, global_mods);
    },
    get number() {
        const guard = Object.assign((v) => typeof v === "number" || (guard.__e.push("Value is not a number."), false), { __e: [] });
        return assignDescriptors(guard, number_mods, global_mods);
    },
    get string() {
        const guard = Object.assign((v) => typeof v === "string" || (guard.__e.push("Value is not a string."), false), { __e: [] });
        return assignDescriptors(guard, string_mods, global_mods);
    },
    get literal() {
        return (lit) => {
            const guard = Object.assign((v) => v === lit || (guard.__e.push(`Value is not the specified literal ${typeof lit}:${lit}.`), false), { __e: [] });
            return assignDescriptors(guard, global_mods);
        };
    },
    get arrayOf() {
        return (type) => {
            const guard = Object.assign((v) => (v instanceof Array || (guard.__e.push(`Value is not an array.`), false)) && (v.every(e => type(e) || (guard.__e.push("Array items are not of the correct type.", ...type.__e), false))), { __e: [] });
            return assignDescriptors(guard, array_mods, global_mods);
        };
    },
    get mapOf() {
        return (type) => {
            const guard = Object.assign((v) => (v && typeof v === "object" || (guard.__e.push("Value is not an object"), false)) && (Object.values(v).every(e => type(e) || (guard.__e.push("Map entries are not of the correct type", ...type.__e), false))), { __e: [] });
            return assignDescriptors(guard, global_mods);
        };
    },
    get shape() {
        return (spec) => {
            const guard = Object.assign((v) => (v && typeof v === "object" || (guard.__e.push("Value is not an object."), false)) && Object.entries(spec).every(([k, gd]) => (k in v ? gd(v[k]) : gd["__optional"]) || (guard.__e.push(`Value is not of correct shape. Key ${k} is ${k in v ? "invalid" : "missing"}.`, ...gd.__e), false)) && (guard["__noextra"] ? Object.keys(v).every(k => k in spec || (guard.__e.push(`Value is not of correct shape. Contains unknown key ${k}, and extra keys are not allowed.`), false)) : true), { __e: [] });
            return assignDescriptors(guard, global_mods);
        };
    },
    get oneOf() {
        return (...types) => {
            const guard = Object.assign((v) => types.some(type => type(v)) || (guard.__e.push("Value is none of the specified types.", ...[].concat(...types.map(type => type.__e))), false), { __e: [] });
            return assignDescriptors(guard, global_mods);
        };
    },
    get allOf() {
        return (...types) => {
            const guard = Object.assign((v) => types.every(type => type(v) || (guard.__e.push("Value is not one of the specified types.", ...type.__e), false)), { __e: [] });
            return assignDescriptors(guard, global_mods);
        };
    },
    get custom() {
        return (type) => {
            const guard = Object.assign((v) => type(v) || (guard.__e.push("Value failed the custom type check."), false), { __e: [] });
            return assignDescriptors(guard, global_mods);
        };
    },
};
exports.V = V;
exports.default = V;
