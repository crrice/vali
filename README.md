# Váli
A simple javascript object validation library with kickass typescript integration.

# Install

`npm install @crrice/vali`

Note that this package requires an ECMAScript 6 compatible runtime to work.
It should work on all up-to-date browsers, but will require polyfills for
older runtimes.

# Usage

### How to Import:

```javascript

// If you use es6 syntax:
import { V } from "@crrice/vali";

// If you use require:
const V = require("@crrice/vali").V;

```

### Create a validator function:

```javascript

import { V } from "@crrice/vali";

// Create a schema. A simple schema for an object:
const validate = V.shape({
	message: V.string,
	count: V.number,

	options: V.shape({
		type: V.oneOf(V.literal("sms"), V.literal("email")).optional,
		targets: V.arrayOf(V.string).optional,
	}).optional,
});

```

### Use the validator function:

A schema is just a function that takes an input and returns if that
input adheres to the right type or not. Use it very simply:

```javascript

const obj = JSON.parse(/* some json string */);

if (validate(obj)) {
	// obj meets the criteria, do your processing here:
} else {
	// obj does not meet the criteria. Return an error or
	// do other processing. You can see why it failed by using:
	console.log(validate.getErrors());

	// That returns an array of strings, showing what went wrong with
	// the validation on the previous invokation of the validator.
	// If there was an issue, the returned array will contain strings
	// logging why the validation failed at each appropriate level.
}

```

### TypeScript

If you're using TypeScript, a validator function will act as a type-guard for
the type it validates:

```typescript

// For our example above, the `validate` function would act as a type guard
// for the following interface:
interface Validated {
	message: string;
	count: number;

	options?: {
		type?: "sms" | "email";
		targets?: string[];
	};
}

// Make sure the thing to validate does not have type `any`.
// Use the type `unknown` in its place.
const obj: unknown = JSON.parse(/* some json string */);

if (validate(obj)) {
	// obj is now assignable to the `Validated` interface.
	const myObj: Validated = obj;

	// Or, you can access properties directly and they will be typed correctly:
	if (obj.options && obj.options.targets) {
		const uppered = obj.options.targets.map(s => s.toUpperCase());
	}
} else {
	// Finally, you can find out what went wrong to return in a response,
	// or to log for later.
	console.log(validate.getErrors());
}

```

# Guide

### Validator functions:

All validator functions are functions of the form:

`(object: any) => boolean`

A validator function also has a `getErrors` method, which accepts no parameters
and retuns an array of strings representing the validation failures on the last
invokation of the validator. The error list is reset every time the validator is
called.

The following `V` functions can be used directly:

```javascript

// Check if value is a string:

V.string("")            // true
V.string("hello world") // true
V.string(3.1415926)     // false

// Check if value is a number:

V.number(3.1415926)     // true
V.number("hello world") // false
V.number(NaN)           // true, there is no special handling for NaN.

// Check if value is a boolean:
V.boolean(true)   // true
V.boolean(false)  // true
V.boolean("true") // false

```

These `V` functions accept one or more arguments you can use to customize their behavior.
They act as factories, accepting the customization option and returning the validator.

```javascript

// Check if value is exactly what is specified:

V.literal("foo")("foo")    // true
V.literal("foo")("bar")    // false
V.literal(null)(null)      // true
V.literal(undefined)(null) // false
V.literal({})({})          // false, two distinct objects are never `===`.

// Check if value is an array of some type:

V.arrayOf(V.number)(3.1415926) // false, input is not an array
V.arrayOf(V.number)(["str"])   // false, not all elements are numbers
V.arrayOf(V.number)([1, 2, 3]) // true
V.arrayOf(V.number)([])        // true, empty arrays are valid for any array type

// Check if value is one of a few enumerated types:

V.oneOf(V.string, V.number)(4)    // true, input is number
V.oneOf(V.string, V.number)("")   // true, input is string
V.oneOf(V.string, V.number)(true) // false, input is neither string nor number.

// Check if value is an object of a certain shape:

V.shape({foo: V.string})({foo: 5})           // false, foo's value is not string.
V.shape({foo: V.string})({foo: ""})          // true
V.shape({foo: V.string})({})                 // false, key 'foo' is missing.
V.shape({foo: V.string})({foo: "", bar: 10}) // true, extra properties are okay

```

### Validation Modifiers

Modifiers can be added to the end of many `V` functions to change or restrict their
behavior.

To use a modifier, simply chain it off the appropriate `V` function:

```javascript

V.shape({
	foo: V.string,          // foo is a required key, and must have a string value
	bar: V.number.optional, // bar is an optional key, but if exists, must nave number value
})

```

#### Modifiers:

##### Global Modifiers:

 - `optional`
   This only takes effect if used on a function that is part of a `V.shape` field.
   It will cause the `V.shape` validator to return true even if the key this is
   attached to is absent.

 - `custom(func)`
   Requires you to pass in a function of the type `(v: unknown) => boolean`, and will
   cause the validator it is attached to to fail if the function returns false when
   given the input value.

##### Number Modifiers:

These modifiers are only accessable on a `V.number` validator.

 - `integer`
   This will cause the validator to fail if the value is not an integer.
   For example, `10` will pass, but `10.5` will not.

 - `max(maximum)`
   Ensures that the number is less than or equal to the maximum.

 - `lt(maximum)`
   Ensures that the number is strictly less than the maximum

 - `min(minimum)`
   Ensures that the number is greater than or equal to the minimum.

 - `gt(minimum)`
   Ensures that the number is strictly greater than the minimum.

 - `interval(range)`
   Ensures the number is within the given interval. The argument is a string
   representing an interval in mathematical notation. Eg: `"[0, 1)"` would be
   a range from 0 (inclusive) to 1 (exclusive). An unbounded range can be given
   by using `Infinity`, so `"(-Infinity, 0)"` would describe a strictly negative
   number. Note that unlike a typical mathematical interval, there is a distinction
   between an inclusive or exclusive bound on `Infinity`. So, `[0, Infinity]` will
   allow the actual `Infinity` value to pass, whereas `[0, Infinity)` will allow any
   positive number (or zero) to pass, but will not allow the special `Infinity` value.

##### String Modifiers:

These modifiers are only accessable on a `V.string` validator.

 - `regex(rgx)`
   This will ensure the string passes the given regex, using `rgx.test`.

 - `email`
   This will ensure the string is a properly formatted email address. This uses
   a regular expression found at emailregex.com

 - `alphanumeric`
   This will ensure the string is composed only of alphanumeric characters (A-Z, a-z, 0-9).
   Case insensitive.

 - `base64`
   This will ensure the string is valid base64 encoded data. This is NOT url safe base64
   so the `-` and `_` are not allowed. This also validates padding, so the string must
   include the proper padding at the end.

 - `hex`
   This will ensure the string is valid hex-encoded binary data (even-length strings only).
   Case insensitive.

 - `uuid`
   This will ensure the string is a valid UUID (RFC 4122 canonical format with dashes).
   Case insensitive.

 - `minLen(minimum)`
   This will ensure the string is the specified length or longer.

 - `maxLen(maximum)`
   This will ensure the string is the specified length or shorter.

 - `isLen(length)`
   This will ensure the string is exactly the specified length.

##### Array Modifiers

These modifiers are only accessable on a `V.arrayOf` validator.

 - `minLen`
   This will ensure the array is the specified length or longer.

 - `maxLen`
   This will ensure the array is the specified length or shorter.

 - `isLen`
   This will ensure the array is exactly the specified length.

##### Shape Modifiers

 - `noextra`
   This will cause the shape validator to return false if keys exist in the input
   that are not present in the shape spec.

# API Reference

### Validator functions:

Without arguments:

 - `V.string` Returns true iff its input is a string.
 - `V.number` Returns true iff its input is a number (including NaN).
 - `V.boolean` Returns true iff its input is a boolean.

With arguments:

 - `V.literal(value)` Returns true if its input is exactly (===) the same as the passed value.
 - `V.arrayOf(validator)` Returns true if the input is an array and all members of the array are of the specified type.
 - `V.oneOf(...validators)` Returns true if the input is one of the specified types.
 - `V.allOf(...validators)` Returns true if the input is all of the specified types.
 - `V.shape(object)` Returns true if the input is an object that matches the types of all specified keys.

### Validator modifiers:

#### Syntax:

 - modifier[(arguments)]: Applies to
   - Effects

#### Modifiers:

##### Global:

 - `optional`: Global
   - Only takes effect when used on a validator that is a field inside a `V.shape` schema.
   - Allows the key it is attached to to be ommited, and the `V.shape` validator will still return true.
 - `custom(func)`: Global
   - Causes validator to fail if the given function returns falsy when passed the input value.

##### Number:

 - `integer`: Number
   - Ensures value has no fractional part.
 - `max(num)`: Number
   - Ensures value is less than or equal to the given number.
 - `lt(num)`: Number
   - Ensures value is strictly less than the given number.
 - `min(num)`: Number
   - Ensures value is greater than or equal to the given number.
 - `gt(num)`: Number
   - Ensures value is strictly greater than the given number.
 - `interval(range)`: Number
   - Ensures value is within the specified interval (uses mathematical interval notation).

##### String:

 - `regex(rgx)`: String
   - Ensures value passes given regex.
 - `email`: String
   - Ensures value is an email address.
 - `alphanumeric`: String
   - Ensures value is composed of only alphanumeric characters (A-Z, a-z, 0-9, case insensitive)
 - `base64`: String
   - Ensures value uses valid standard base64 encoding.
 - `hex`: String
   - Ensures value uses valid hex-encoded binary data (even-length strings, case insensitive).
 - `uuid`: String
   - Ensures value is a valid UUID string (RFC 4122 format with dashes, case insensitive).
 - `minLen(minimum)`
   - Ensures value has at least the specified length.
 - `maxLen(maximum)`
   - Ensures value has at most the specified length.
 - `isLen(length)`
   - Ensures value has exactly the specified length.

##### Array:

 - `minLen(minimum)`
   - Ensures value has at least the specified length.
 - `maxLen(maximum)`
   - Ensures value has at most the specified length.
 - `isLen(length)`
   - Ensures value has exactly the specified length.

##### Shape:

 - `noextra`: Shape
   - Only takes effect when used on a `V.shape` validator.
   - Disallows extra keys in the input. Keys in the input that are not specified in the schema will cause the validator to return false.

