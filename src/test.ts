
import { V } from "./index";

//--- Cases ---\\

const number_cases: Case[] = [{
	n: "V.number",
	f: V.number,
	io: [
		{i: undefined, o: false},
		{i: null, o: false},
		{i: true, o: false},
		{i: false, o: false},
		{i: "", o: false},
		{i: "hello", o: false},
		{i: {}, o: false},
		{i: 0, o: true},
		{i: 1, o: true},
		{i: 0.5, o: true},
		{i: Infinity, o: true},
		{i: -1, o: true},
		{i: NaN, o: true}
	],
}, {
	n: "V.number.max(10)",
	f: V.number.max(10),
	io: [
		{i: 10, o: true},
		{i: 9, o: true},
		{i: 11, o: false},
		{i: 10.00000000001, o: false},
		{i: 9.999999999, o: true},
		{i: -Infinity, o: true},
	],
}, {
	n: "V.number.min(10)",
	f: V.number.min(10),
	io: [
		{i: 10, o: true},
		{i: 9, o: false},
		{i: 11, o: true},
		{i: 10.00000000001, o: true},
		{i: 9.999999999, o: false},
		{i: Infinity, o: true},
	],
}, {
	n: "V.number.lt(10)",
	f: V.number.lt(10),
	io: [
		{i: 10, o: false},
		{i: 9, o: true},
		{i: 11, o: false},
		{i: 10.00000000001, o: false},
		{i: 9.999999999, o: true},
		{i: -Infinity, o: true},
	],
}, {
	n: "V.number.gt(10)",
	f: V.number.gt(10),
	io: [
		{i: 10, o: false},
		{i: 9, o: false},
		{i: 11, o: true},
		{i: 10.00000000001, o: true},
		{i: 9.999999999, o: false},
		{i: Infinity, o: true},
	],
}, {
	n: "V.number.integer",
	f: V.number.integer,
	io: [
		{i: 10, o: true},
		{i: 10.1, o: false},
		{i: -10, o: true},
		{i: 0, o: true},
		{i: NaN, o: false},
		{i: Infinity, o: false},
	],
}, {
	n: `V.number.interval("[0, 1)")`,
	f: V.number.interval("[0, 1)"),
	io: [
		{i: 0, o: true},
		{i: 1, o: false},
		{i: -1, o: false},
		{i: 2, o: false},
		{i: 0.5, o: true},
		{i: NaN, o: false},
	],
}, {
	n: `V.number.interval("(1, Infinity]")`,
	f: V.number.interval("(1, Infinity]"),
	io: [
		{i: 1, o: false},
		{i: 0, o: false},
		{i: 2, o: true},
		{i: Number.MAX_VALUE, o: true},
		{i: Infinity, o: true},
	],
}, {
	n: "V.number.min(1).max(100).integer",
	f: V.number.min(1).max(100).integer,
	io: [
		{i: 0, o: false},
		{i: 1, o: true},
		{i: 1.1, o: false},
		{i: 2, o: true},
		{i: 100, o: true},
		{i: 101, o: false},
		{i: NaN, o: false},
		{i: Infinity, o: false},
		{i: -Infinity, o: false},
	],
}];

const string_cases: Case[] = [{
	n: "V.string",
	f: V.string,
	io: [
		{i: undefined, o: false},
		{i: null, o: false},
		{i: true, o: false},
		{i: false, o: false},
		{i: "", o: true},
		{i: "hello", o: true},
		{i: {}, o: false},
		{i: 0, o: false},
		{i: NaN, o: false},
	],
}, {
	n: "V.string.regex(/^hello world$/i)",
	f: V.string.regex(/^hello world$/i),
	io: [
		{i: "hello world", o: true},
		{i: "HELLO WORLD", o: true},
		{i: "hElLo WoRlD", o: true},
		{i: "hello_world", o: false},
		{i: "", o: false},
	],
}, {
	n: "V.string.email",
	f: V.string.email,
	io: [
		{i: "", o: false},
		{i: "conor@addmi.com", o: true},
		{i: "conor@@addmi.com", o: false},
	],
}, {
	n: "V.string.alphanumeric",
	f: V.string.alphanumeric,
	io: [
		{i: "", o: true},
		{i: "asdf1234", o: true},
		{i: "ASDF1234", o: true},
		{i: "AsDf1234", o: true},
		{i: "10*10=100", o: false},
	],
}, {
	n: "V.strng.base64",
	f: V.string.base64,
	io: [
		{i: "", o: true},
		{i: "dGhyZWU=", o: true},
		{i: "dGhyZWU", o: false},
	],
}, {
	n: "V.string.hex",
	f: V.string.hex,
	io: [
		{i: "", o: true},
		{i: "deadbeef", o: true},
		{i: "DEADBEEF", o: true},
		{i: "DeAdBeEf", o: true},
		{i: "deadbee", o: false},
		{i: "12345678", o: true},
		{i: "1234567", o: false},
	],
}, {
	n: "V.string.uuid",
	f: V.string.uuid,
	io: [
		{i: "550e8400-e29b-41d4-a716-446655440000", o: true},
		{i: "550E8400-E29B-41D4-A716-446655440000", o: true},
		{i: "550e8400-E29B-41d4-A716-446655440000", o: true},
		{i: "00000000-0000-0000-0000-000000000000", o: true},
		{i: "6ba7b810-9dad-11d1-80b4-00c04fd430c8", o: true},
		{i: "550e8400e29b41d4a716446655440000", o: false},
		{i: "550e8400-e29b-41d4-a716-44665544000", o: false},
		{i: "550e8400-e29b-41d4-a716", o: false},
		{i: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", o: false},
		{i: "", o: false},
		{i: "550e8400-e29b-41d4-a716-446655440000-extra", o: false},
		{i: "550e8400-e29b-41g4-a716-446655440000", o: false},
		{i: "550e8400-e29b-41d4-a716-44665544000z", o: false},
	],
}, {
	n: "V.string.url",
	f: V.string.url,
	io: [
		{i: "https://example.com", o: true},
		{i: "http://example.com", o: true},
		{i: "ftp://files.example.com", o: true},
		{i: "https://example.com/path?query=1#hash", o: true},
		{i: "http://192.168.1.1:8080", o: true},
		{i: "http://localhost:3000", o: true},
		{i: "https://example.com:443/path", o: true},
		{i: "javascript:alert(1)", o: false},
		{i: "data:text/plain,hello", o: false},
		{i: "mailto:user@example.com", o: false},
		{i: "file:///etc/passwd", o: false},
		{i: "example.com", o: false},
		{i: "//example.com", o: false},
		{i: "not a url", o: false},
		{i: "", o: false},
		{i: "https://", o: false},
	],
}, {
	n: "V.string.minLen(4)",
	f: V.string.minLen(4),
	io: [
		{i: "", o: false},
		{i: "123", o: false},
		{i: "1234", o: true},
		{i: "12345", o: true},
	],
}, {
	n: "V.string.maxLen(3)",
	f: V.string.maxLen(3),
	io: [
		{i: "", o: true},
		{i: "123", o: true},
		{i: "1234", o: false},
		{i: "12345", o: false},
	],
}, {
	n: "V.string.isLen(3)",
	f: V.string.isLen(3),
	io: [
		{i: "", o: false},
		{i: "123", o: true},
		{i: "1234", o: false},
		{i: "12345", o: false},
	],
}, {
	n: "V.string.regex(/^#[a-f0-9]{6}/).isLen(7)",
	f: V.string.regex(/^#[a-f0-9]{6}/).isLen(7),
	io: [
		{i: "", o: false},
		{i: "#fe7b07", o: true},
		{i: "#fff", o: false},
		{i: "#abcdeg", o: false},
	],
}];

const boolean_cases: Case[] = [{
	n: "V.boolean",
	f: V.boolean,
	io: [
		{i: undefined, o: false},
		{i: true, o: true},
		{i: false, o: true},
		{i: "", o: false},
		{i: 0, o: false},
		{i: {}, o: false},
	],
}];

const literal_cases: Case[] = [{
	n: "V.literal(undefined)",
	f: V.literal(undefined),
	io: [
		{i: undefined, o: true},
		{i: null, o: false},
		{i: "undefined", o: false},
		{i: 0, o: false},
	],
}, {
	n: "V.literal({})",
	f: V.literal({}),
	io: [
		{i: undefined, o: false},
		{i: {}, o: false}, // No two distict objs are ===.
	],
}];

const array_cases: Case[] = [{
	n: "V.arrayOf(V.number)",
	f: V.arrayOf(V.number),
	io: [
		{i: [], o: true},
		{i: [1, 2, 3], o: true},
		{i: ["a", "b"], o: false},
		{i: [1, "a"], o: false},
	],
}, {
	n: "V.arrayOf(V.number).minLen(2).maxLen(4)",
	f: V.arrayOf(V.number).minLen(2).maxLen(4),
	io: [
		{i: [], o: false},
		{i: [1], o: false},
		{i: [1, 2], o: true},
		{i: [1, 2, 3, 4], o: true},
		{i: [1, 2, 3, 4, 5], o: false},
		{i: [1, 2, 3, "4"], o: false},
	],
}, {
	n: "V.arrayOf(V.number).isLen(3)",
	f: V.arrayOf(V.number).isLen(3),
	io: [
		{i: [], o: false},
		{i: [1], o: false},
		{i: [1, 2, 3], o: true},
		{i: [1, 2, "3"], o: false},
		{i: [1, 2, 3, 4, 5], o: false},
	],
}];

const map_cases: Case[] = [{
	n: "V.mapOf(V.number)",
	f: V.mapOf(V.number),
	io: [
		{i: {}, o: true},
		{i: {a: 1, b: 2}, o: true},
		{i: {a: "a", b: "b"}, o: false},
		{i: {a: 1, b: "b"}, o: false},
	],
}];

const shape_cases: Case[] = [{
	n: "V.shape({foo: V.string})",
	f: V.shape({foo: V.string}),
	io: [
		{i: undefined, o: false},
		{i: [], o: false},
		{i: {}, o: false},
		{i: {foo: 4}, o: false},
		{i: {foo: "a"}, o: true},
		{i: {foo: "a", bar: "b"}, o: true},
	],
}, {
	n: "V.shape({foo: V.string, bar: V.number.optional}).noextra",
	f: V.shape({foo: V.string, bar: V.number.optional}).noextra,
	io: [
		{i: {}, o: false},
		{i: {foo: 4}, o: false},
		{i: {foo: "a"}, o: true},
		{i: {foo: 4, bar: 2}, o: false},
		{i: {foo: "a", bar: 2}, o: true},
		{i: {foo: "a", bar: "b"}, o: false},
		{i: {foo: "a", bar: 2, baz: true}, o: false},
	],
}];

const oneof_cases: Case[] = [{
	n: "V.oneOf(V.number, V.string)",
	f: V.oneOf(V.number, V.string),
	io: [
		{i: true, o: false},
		{i: "foo", o: true},
		{i: 10, o: true},
	],
}];

const allof_cases: Case[] = [{
	n: "V.allOf(V.shape({foo: V.string}), V.mapOf(V.oneOf(V.string, V.number)))",
	f: V.allOf(V.shape({foo: V.string}), V.mapOf(V.oneOf(V.string, V.number))),
	io: [
		{i: {}, o: false},
		{i: {foo: 4}, o: false},
		{i: {foo: "a"}, o: true},
		{i: {foo: "a", bar: "b"}, o: true},
		{i: {foo: "a", bar: 1}, o: true},
	],
}];

const custom_cases: Case[] = [{
	n: `V.custom(v => typeof v === "string" && v.startsWith("foo"))`,
	f: V.custom((v => typeof v === "string" && v.startsWith("foo")) as ((v: unknown) => v is any)),
	io: [
		{i: 9, o: false},
		{i: "", o: false},
		{i: "foo", o: true},
		{i: "bar", o: false},
		{i: "foobar", o: true},
	],
}];

const withMessage_cases: Case[] = [{
	n: "V.string.email.withMessage('Custom email error')",
	f: V.string.email.withMessage("Custom email error"),
	io: [
		{i: "valid@email.com", o: true},
		{i: "invalid", o: false},
	],
}, {
	n: "V.number.min(18).withMessage('Must be adult')",
	f: V.number.min(18).withMessage("Must be adult"),
	io: [
		{i: 18, o: true},
		{i: 25, o: true},
		{i: 17, o: false},
		{i: 0, o: false},
	],
}, {
	n: "V.string.uuid.withMessage('Invalid resource ID')",
	f: V.string.uuid.withMessage("Invalid resource ID"),
	io: [
		{i: "550e8400-e29b-41d4-a716-446655440000", o: true},
		{i: "invalid", o: false},
		{i: "", o: false},
	],
}];

const combo_cases: Case[] = [{
	n: `V.shape({foo: V.oneOf(V.literal("foo"), V.literal("bar")), bar: V.arrayOf(V.number).isLen(2)}).noextra`,
	f: V.shape({foo: V.oneOf(V.literal("foo"), V.literal("bar")), bar: V.arrayOf(V.number).isLen(2).optional}).noextra,
	io: [
		{i: {}, o: false},
		{i: {foo: "bar"}, o: true},
		{i: {foo: "baz"}, o: false},
		{i: {foo: "foo", bar: []}, o: false},
		{i: {foo: "foo", bar: [1, 2]}, o: true},
		{i: {foo: "foo", bar: [1, 2], bax: true}, o: false},
	],
}];

const cases: Case[] = [
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
	...withMessage_cases,
	...combo_cases,
];

//--- Error Message Tests ---\\

// Group 1: Single validator with multiple withMessage modifiers
// Purpose: Verify that only the withMessage for the failing check appears

const singleValidatorMultipleMessages = V.string
	.withMessage("Must be a string")
	.minLen(5)
	.withMessage("Must be at least 5 characters");

const group1_cases = [
	{
		n: "Single validator - fail at type check",
		f: singleValidatorMultipleMessages,
		i: 123,
		expected: ["Must be a string", "Value is not a string."]
	},
	{
		n: "Single validator - fail at length check",
		f: singleValidatorMultipleMessages,
		i: "ab",
		expected: ["Must be at least 5 characters", "Value is shorter than minimum length of 5."]
	},
	{
		n: "Single validator - success",
		f: singleValidatorMultipleMessages,
		i: "hello",
		expected: []
	},
];

// Group 2: Nested validators with breadcrumb trail
// Purpose: Verify that withMessage contexts stack across different validators

const nestedValidatorBreadcrumbs = V.shape({
	user: V.shape({
		email: V.string.email.withMessage("Invalid email format")
	}).withMessage("User object invalid")
}).withMessage("Request validation failed");

const group2_cases = [
	{
		n: "Nested validators - all contexts appear",
		f: nestedValidatorBreadcrumbs,
		i: {user: {email: "invalid"}},
		expected: [
			"Request validation failed",
			"Value is not of correct shape. Key 'user' is invalid.",
			"User object invalid",
			"Value is not of correct shape. Key 'email' is invalid.",
			"Invalid email format",
			"Value is not a valid email address."
		]
	},
	{
		n: "Nested validators - success",
		f: nestedValidatorBreadcrumbs,
		i: {user: {email: "valid@example.com"}},
		expected: []
	},
];

// Group 3: Combined scenario
// Purpose: Verify everything works together in a realistic use case

const combinedValidator = V.shape({
	username: V.string
		.withMessage("Username must be a string")
		.minLen(3)
		.withMessage("Username must be at least 3 characters")
		.maxLen(20)
		.withMessage("Username must be at most 20 characters"),
	profile: V.shape({
		email: V.string
			.withMessage("Email must be a string")
			.email
			.withMessage("Email format is invalid")
	}).withMessage("Profile data is invalid")
}).noextra.withMessage("Registration data validation failed");

const group3_cases = [
	{
		n: "Combined - username not a string",
		f: combinedValidator,
		i: {username: 123, profile: {email: "valid@example.com"}},
		expected: [
			"Registration data validation failed",
			"Value is not of correct shape. Key 'username' is invalid.",
			"Username must be a string",
			"Value is not a string."
		]
	},
	{
		n: "Combined - username too short",
		f: combinedValidator,
		i: {username: "ab", profile: {email: "valid@example.com"}},
		expected: [
			"Registration data validation failed",
			"Value is not of correct shape. Key 'username' is invalid.",
			"Username must be at least 3 characters",
			"Value is shorter than minimum length of 3."
		]
	},
	{
		n: "Combined - username too long",
		f: combinedValidator,
		i: {username: "thisusernameiswaytoolongandexceedsmaximum", profile: {email: "valid@example.com"}},
		expected: [
			"Registration data validation failed",
			"Value is not of correct shape. Key 'username' is invalid.",
			"Username must be at most 20 characters",
			"Value is longer than maximum length of 20"
		]
	},
	{
		n: "Combined - email not a string",
		f: combinedValidator,
		i: {username: "valid", profile: {email: 123}},
		expected: [
			"Registration data validation failed",
			"Value is not of correct shape. Key 'profile' is invalid.",
			"Profile data is invalid",
			"Value is not of correct shape. Key 'email' is invalid.",
			"Email must be a string",
			"Value is not a string."
		]
	},
	{
		n: "Combined - email invalid format",
		f: combinedValidator,
		i: {username: "valid", profile: {email: "invalid"}},
		expected: [
			"Registration data validation failed",
			"Value is not of correct shape. Key 'profile' is invalid.",
			"Profile data is invalid",
			"Value is not of correct shape. Key 'email' is invalid.",
			"Email format is invalid",
			"Value is not a valid email address."
		]
	},
	{
		n: "Combined - success",
		f: combinedValidator,
		i: {username: "validuser", profile: {email: "valid@example.com"}},
		expected: []
	},
];

// Group 4: Additional validator types and edge cases with withMessage
// Purpose: Verify withMessage works with all validator types and edge cases are clear

const group4_cases = [
	{
		n: "arrayOf - withMessage on element validator",
		f: V.arrayOf(V.number.min(0).withMessage("Must be non-negative")),
		i: [1, 2, -3],
		expected: [
			"Array items are not of the correct type.",
			"Must be non-negative",
			"Value is smaller than minimum of 0."
		]
	},
	{
		n: "oneOf - withMessage on union",
		f: V.oneOf(V.string, V.number).withMessage("Must be string or number"),
		i: true,
		expected: [
			"Must be string or number",
			"Value is none of the specified types.",
			"Value is not a string.",
			"Value is not a number."
		]
	},
	{
		n: "Double-chained withMessage - only first appears",
		f: V.string.withMessage("First").withMessage("Second"),
		i: 123,
		expected: [
			"First",
			"Value is not a string."
		]
	},
	{
		n: "withMessage after modifiers - single context for any failure",
		f: V.string.minLen(5).maxLen(10).withMessage("Invalid username"),
		i: "ab",
		expected: [
			"Invalid username",
			"Value is shorter than minimum length of 5."
		]
	},
	{
		n: "optional with withMessage - missing field (valid)",
		f: V.shape({
			field: V.string.optional.withMessage("Field must be a string")
		}),
		i: {},
		expected: []
	},
	{
		n: "optional with withMessage - invalid field value",
		f: V.shape({
			field: V.string.optional.withMessage("Field must be a string")
		}),
		i: {field: 123},
		expected: [
			"Value is not of correct shape. Key 'field' is invalid.",
			"Field must be a string",
			"Value is not a string."
		]
	},
];

const error_cases = [
	...group1_cases,
	...group2_cases,
	...group3_cases,
	...group4_cases,
];

//--- Run Tests ---\\

const results = cases.map(c => {
	console.log("Running Function:", c.n || c.f.name);
	return c.io.every(io => c.f(io.i) === io.o || (console.error("Failed for input:", io.i, "Got:", c.f(io.i), "Expected:", io.o), false));
});

const error_results = error_cases.map(c => {
	console.log("Running Error Test:", c.n);
	c.f(c.i); // Run validation
	const errors = c.f.getErrors();
	const match = errors.length === c.expected.length && errors.every((e, i) => e === c.expected[i]);
	if (!match) {
		console.error("Error mismatch for:", c.n);
		console.error("  Input:", c.i);
		console.error("  Expected:", c.expected);
		console.error("  Got:", errors);
	}
	return match;
});

if (results.every(Boolean) && error_results.every(Boolean)) {
	console.log("All tests succeeded!")
} else {
	console.error("Some tests failed, check above output for details.");
	throw new Error("At least one test has failed.");
}

//--- Types ---\\

type Case = {
	n: string;
	f: (...args: any[]) => any;
	io: {
		i: any;
		o: any;
	}[];
}

// NOTE: This is a test of the typescript integration of this package. As you can see, this
// has no effect on runtime, but should compile (tsc) without error. If there is a compile
// error, then there is a typing bug that must be fixed (even though it may still work at runtime).

interface TestAssignToMe {
	foo: "foo" | "bar";
	bar?: number[];
}

if (false as boolean) {
	const f = V.shape({foo: V.oneOf(V.literal("foo"), V.literal("bar")), bar: V.arrayOf(V.number).isLen(2).optional}).noextra;
	const v: unknown = undefined;

	if (f(v)) {
		v.foo
		v.bar
		const test1: TestAssignToMe = v;
		const test2: number = v.bar && v.bar[0] || 0;
		console.log(test1, test2);
	} else {
		throw new Error("Type did not satisfy predecate!");
	}
}

if (false as boolean) {
	const f = V.string.uuid;
	const v: unknown = undefined;

	if (f(v)) {
		v.toUpperCase();
		v.toLowerCase();
		const test: string = v;
		console.log(test.length);
	} else {
		throw new Error("Type did not satisfy predicate!");
	}
}
