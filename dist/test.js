"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const number_cases = [{
        n: "V.number",
        f: index_1.V.number,
        io: [
            { i: undefined, o: false },
            { i: null, o: false },
            { i: true, o: false },
            { i: false, o: false },
            { i: "", o: false },
            { i: "hello", o: false },
            { i: {}, o: false },
            { i: 0, o: true },
            { i: 1, o: true },
            { i: 0.5, o: true },
            { i: Infinity, o: true },
            { i: -1, o: true },
            { i: NaN, o: true }
        ],
    }, {
        n: "V.number.max(10)",
        f: index_1.V.number.max(10),
        io: [
            { i: 10, o: true },
            { i: 9, o: true },
            { i: 11, o: false },
            { i: 10.00000000001, o: false },
            { i: 9.999999999, o: true },
            { i: -Infinity, o: true },
        ],
    }, {
        n: "V.number.min(10)",
        f: index_1.V.number.min(10),
        io: [
            { i: 10, o: true },
            { i: 9, o: false },
            { i: 11, o: true },
            { i: 10.00000000001, o: true },
            { i: 9.999999999, o: false },
            { i: Infinity, o: true },
        ],
    }, {
        n: "V.number.lt(10)",
        f: index_1.V.number.lt(10),
        io: [
            { i: 10, o: false },
            { i: 9, o: true },
            { i: 11, o: false },
            { i: 10.00000000001, o: false },
            { i: 9.999999999, o: true },
            { i: -Infinity, o: true },
        ],
    }, {
        n: "V.number.gt(10)",
        f: index_1.V.number.gt(10),
        io: [
            { i: 10, o: false },
            { i: 9, o: false },
            { i: 11, o: true },
            { i: 10.00000000001, o: true },
            { i: 9.999999999, o: false },
            { i: Infinity, o: true },
        ],
    }, {
        n: "V.number.integer",
        f: index_1.V.number.integer,
        io: [
            { i: 10, o: true },
            { i: 10.1, o: false },
            { i: -10, o: true },
            { i: 0, o: true },
            { i: NaN, o: false },
            { i: Infinity, o: false },
        ],
    }, {
        n: `V.number.interval("[0, 1)")`,
        f: index_1.V.number.interval("[0, 1)"),
        io: [
            { i: 0, o: true },
            { i: 1, o: false },
            { i: -1, o: false },
            { i: 2, o: false },
            { i: 0.5, o: true },
            { i: NaN, o: false },
        ],
    }, {
        n: `V.number.interval("(1, Infinity]")`,
        f: index_1.V.number.interval("(1, Infinity]"),
        io: [
            { i: 1, o: false },
            { i: 0, o: false },
            { i: 2, o: true },
            { i: Number.MAX_VALUE, o: true },
            { i: Infinity, o: true },
        ],
    }, {
        n: "V.number.min(1).max(100).integer",
        f: index_1.V.number.min(1).max(100).integer,
        io: [
            { i: 0, o: false },
            { i: 1, o: true },
            { i: 1.1, o: false },
            { i: 2, o: true },
            { i: 100, o: true },
            { i: 101, o: false },
            { i: NaN, o: false },
            { i: Infinity, o: false },
            { i: -Infinity, o: false },
        ],
    }];
const string_cases = [{
        n: "V.string",
        f: index_1.V.string,
        io: [
            { i: undefined, o: false },
            { i: null, o: false },
            { i: true, o: false },
            { i: false, o: false },
            { i: "", o: true },
            { i: "hello", o: true },
            { i: {}, o: false },
            { i: 0, o: false },
            { i: NaN, o: false },
        ],
    }, {
        n: "V.string.regex(/^hello world$/i)",
        f: index_1.V.string.regex(/^hello world$/i),
        io: [
            { i: "hello world", o: true },
            { i: "HELLO WORLD", o: true },
            { i: "hElLo WoRlD", o: true },
            { i: "hello_world", o: false },
            { i: "", o: false },
        ],
    }, {
        n: "V.string.email",
        f: index_1.V.string.email,
        io: [
            { i: "", o: false },
            { i: "conor@addmi.com", o: true },
            { i: "conor@@addmi.com", o: false },
        ],
    }, {
        n: "V.string.alphanumeric",
        f: index_1.V.string.alphanumeric,
        io: [
            { i: "", o: true },
            { i: "asdf1234", o: true },
            { i: "10*10=100", o: false },
        ],
    }, {
        n: "V.strng.base64",
        f: index_1.V.string.base64,
        io: [
            { i: "", o: true },
            { i: "dGhyZWU=", o: true },
            { i: "dGhyZWU", o: false },
        ],
    }, {
        n: "V.string.hex",
        f: index_1.V.string.hex,
        io: [
            { i: "", o: true },
            { i: "deadbeef", o: true },
            { i: "deadbee", o: false },
        ],
    }, {
        n: "V.string.minLen(4)",
        f: index_1.V.string.minLen(4),
        io: [
            { i: "", o: false },
            { i: "123", o: false },
            { i: "1234", o: true },
            { i: "12345", o: true },
        ],
    }, {
        n: "V.string.maxLen(3)",
        f: index_1.V.string.maxLen(3),
        io: [
            { i: "", o: true },
            { i: "123", o: true },
            { i: "1234", o: false },
            { i: "12345", o: false },
        ],
    }, {
        n: "V.string.isLen(3)",
        f: index_1.V.string.isLen(3),
        io: [
            { i: "", o: false },
            { i: "123", o: true },
            { i: "1234", o: false },
            { i: "12345", o: false },
        ],
    }, {
        n: "V.string.regex(/^#[a-f0-9]{6}/).isLen(7)",
        f: index_1.V.string.regex(/^#[a-f0-9]{6}/).isLen(7),
        io: [
            { i: "", o: false },
            { i: "#fe7b07", o: true },
            { i: "#fff", o: false },
            { i: "#abcdeg", o: false },
        ],
    }];
const boolean_cases = [{
        n: "V.boolean",
        f: index_1.V.boolean,
        io: [
            { i: undefined, o: false },
            { i: true, o: true },
            { i: false, o: true },
            { i: "", o: false },
            { i: 0, o: false },
            { i: {}, o: false },
        ],
    }];
const literal_cases = [{
        n: "V.literal(undefined)",
        f: index_1.V.literal(undefined),
        io: [
            { i: undefined, o: true },
            { i: null, o: false },
            { i: "undefined", o: false },
            { i: 0, o: false },
        ],
    }, {
        n: "V.literal({})",
        f: index_1.V.literal({}),
        io: [
            { i: undefined, o: false },
            { i: {}, o: false },
        ],
    }];
const array_cases = [{
        n: "V.arrayOf(V.number)",
        f: index_1.V.arrayOf(index_1.V.number),
        io: [
            { i: [], o: true },
            { i: [1, 2, 3], o: true },
            { i: ["a", "b"], o: false },
            { i: [1, "a"], o: false },
        ],
    }, {
        n: "V.arrayOf(V.number).minLen(2).maxLen(4)",
        f: index_1.V.arrayOf(index_1.V.number).minLen(2).maxLen(4),
        io: [
            { i: [], o: false },
            { i: [1], o: false },
            { i: [1, 2], o: true },
            { i: [1, 2, 3, 4], o: true },
            { i: [1, 2, 3, 4, 5], o: false },
            { i: [1, 2, 3, "4"], o: false },
        ],
    }, {
        n: "V.arrayOf(V.number).isLen(3)",
        f: index_1.V.arrayOf(index_1.V.number).isLen(3),
        io: [
            { i: [], o: false },
            { i: [1], o: false },
            { i: [1, 2, 3], o: true },
            { i: [1, 2, "3"], o: false },
            { i: [1, 2, 3, 4, 5], o: false },
        ],
    }];
const map_cases = [{
        n: "V.mapOf(V.number)",
        f: index_1.V.mapOf(index_1.V.number),
        io: [
            { i: {}, o: true },
            { i: { a: 1, b: 2 }, o: true },
            { i: { a: "a", b: "b" }, o: false },
            { i: { a: 1, b: "b" }, o: false },
        ],
    }];
const shape_cases = [{
        n: "V.shape({foo: V.string})",
        f: index_1.V.shape({ foo: index_1.V.string }),
        io: [
            { i: undefined, o: false },
            { i: [], o: false },
            { i: {}, o: false },
            { i: { foo: 4 }, o: false },
            { i: { foo: "a" }, o: true },
            { i: { foo: "a", bar: "b" }, o: true },
        ],
    }, {
        n: "V.shape({foo: V.string, bar: V.number.optional}).noextra",
        f: index_1.V.shape({ foo: index_1.V.string, bar: index_1.V.number.optional }).noextra,
        io: [
            { i: {}, o: false },
            { i: { foo: 4 }, o: false },
            { i: { foo: "a" }, o: true },
            { i: { foo: 4, bar: 2 }, o: false },
            { i: { foo: "a", bar: 2 }, o: true },
            { i: { foo: "a", bar: "b" }, o: false },
            { i: { foo: "a", bar: 2, baz: true }, o: false },
        ],
    }];
const oneof_cases = [{
        n: "V.oneOf(V.number, V.string)",
        f: index_1.V.oneOf(index_1.V.number, index_1.V.string),
        io: [
            { i: true, o: false },
            { i: "foo", o: true },
            { i: 10, o: true },
        ],
    }];
const allof_cases = [{
        n: "V.allOf(V.shape({foo: V.string}), V.mapOf(V.oneOf(V.string, V.number)))",
        f: index_1.V.allOf(index_1.V.shape({ foo: index_1.V.string }), index_1.V.mapOf(index_1.V.oneOf(index_1.V.string, index_1.V.number))),
        io: [
            { i: {}, o: false },
            { i: { foo: 4 }, o: false },
            { i: { foo: "a" }, o: true },
            { i: { foo: "a", bar: "b" }, o: true },
            { i: { foo: "a", bar: 1 }, o: true },
        ],
    }];
const custom_cases = [{
        n: `V.custom(v => typeof v === "string" && v.startsWith("foo"))`,
        f: index_1.V.custom((v => typeof v === "string" && v.startsWith("foo"))),
        io: [
            { i: 9, o: false },
            { i: "", o: false },
            { i: "foo", o: true },
            { i: "bar", o: false },
            { i: "foobar", o: true },
        ],
    }];
const combo_cases = [{
        n: `V.shape({foo: V.oneOf(V.literal("foo"), V.literal("bar")), bar: V.arrayOf(V.number).isLen(2)}).noextra`,
        f: index_1.V.shape({ foo: index_1.V.oneOf(index_1.V.literal("foo"), index_1.V.literal("bar")), bar: index_1.V.arrayOf(index_1.V.number).isLen(2).optional }).noextra,
        io: [
            { i: {}, o: false },
            { i: { foo: "bar" }, o: true },
            { i: { foo: "baz" }, o: false },
            { i: { foo: "foo", bar: [] }, o: false },
            { i: { foo: "foo", bar: [1, 2] }, o: true },
            { i: { foo: "foo", bar: [1, 2], bax: true }, o: false },
        ],
    }];
const cases = [
    ...number_cases,
    ...string_cases,
    ...boolean_cases,
    ...literal_cases,
    ...array_cases,
    ...map_cases,
    ...shape_cases,
    ...oneof_cases,
    ...allof_cases,
    ...custom_cases,
    ...combo_cases,
];
const results = cases.map(c => {
    console.log("Running Function:", c.n || c.f.name);
    return c.io.every(io => c.f(io.i) === io.o || !!console.error("Failed for input:", io.i, "Got:", c.f(io.i), "Expected:", io.o));
});
if (results.every(Boolean)) {
    console.log("All tests succeeded!");
}
else {
    console.error("Some tests failed, check above output for details.");
    throw new Error("At least one test has failed.");
}
if (false) {
    const f = index_1.V.shape({ foo: index_1.V.oneOf(index_1.V.literal("foo"), index_1.V.literal("bar")), bar: index_1.V.arrayOf(index_1.V.number).isLen(2).optional }).noextra;
    const v = undefined;
    if (f(v)) {
        v.foo;
        v.bar;
        const test1 = v;
        const test2 = v.bar && v.bar[0] || 0;
        console.log(test1, test2);
    }
    else {
        throw new Error("Type did not satisfy predecate!");
    }
}
