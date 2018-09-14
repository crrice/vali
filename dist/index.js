"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.V = {
    get string() {
        return makeV(v => typeof v === "string");
    },
    get number() {
        return makeV(v => typeof v === "number");
    },
    get boolean() {
        return makeV(v => typeof v === "boolean");
    },
    literal(value) {
        return makeV(v => v === value);
    },
    arrayOf(type) {
        return makeV(v => v instanceof Array && v.every(type));
    },
    oneOf(...types) {
        return makeV(v => types.some(t => t(v)));
    },
    allOf(...types) {
        return makeV(v => types.every(t => t(v)));
    },
    custom(func) {
        return makeV(func);
    },
    shape(obj) {
        const vfunc = (v) => v
            && typeof v === "object"
            && Object.entries(obj).every(([k, vdr]) => k in v
                ? vdr(v[k])
                : vdr["v_optional"])
            && (vfunc["v_noextra"]
                ? Object.keys(v).every(k => k in obj)
                : true);
        return makeV(vfunc);
    }
};
function makeV(f) {
    return Object.defineProperties(f, {
        optional: {
            get: function () { f["v_optional"] = true; return f; }
        },
        noextra: {
            get: function () { f["v_noextra"] = true; return f; }
        },
    });
}
