# Váli
A simple javascript object validation library.

# Install

`npm install @crrice/vali`

Note that this package depends on newer ECMAScript features such as `Array.prototype.every`,
`Array.prototype.some`, `Object.prototype.entries`, and property descriptors. Make sure that
these are polyfilled if you intend to use this package in an older runtime.

# Usage

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
	// do other processing.
}

```

# API Reference

### Validator functions:

All validator functions are functions of the form:

`(object: any) => boolean`

The following `V` functions take no arguments:

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

We also support custom validators so you can further restrict the type of your
inputs to be whatever you can dream up. We do this by using the `V.custom` function
or by combining existing validators with a custom function using `V.allOf`.

You can also use a plain function wherever a validation function is expected, without
needing it to be wrapped in the `V.custom` method. So for example:

`V.shape({foo: v => v instanceof MyClass})`

is a perfectly valid shape spec. However, wrapping your custom validators in `V.custom`
will allow you to chain modifiers onto them. See the modifiers section for more.

```javascript

// Example custom validator: is truthy:

V.custom(v => !!v)(0)  // false, 0 is falsy
V.custom(v => !!v)({}) // true, {} is truthy

```

You can use the `V.allOf` method to combine validators. The `V.allOf` method will take
all the validators it is given and produce a new function that returns true only if all
of it's component validators return true. This is particularly helpful when you want
to extend a validator you already have to be more specific:

```javascript

// Example extended validator: is number between 1 and 100.

V.allOf(V.number, v => v >=0 && v <= 100)(77) // true
V.allOf(V.number, v => v >=0 && v <= 100)(-1) // false

// the V.allOf function will bail out on the first fail, making it safe to
// assume that all prior ones have passed when looking at the value in later ones.
// This is helpful when you want to use a prototype method on the type, for example.

V.allOf(V.string, v => v.startsWith("safe"))(undefined) // false, and safe to call with any value

```

### Validation Modifiers

Modifiers can be added to the end of any `V` function to change it's validation behavior
in some ways.

To use a modifier, simply chain it off any `V` function:

```javascript

V.shape({
	foo: V.string,          // foo is a required key, and must have a string value
	bar: V.number.optional, // bar is an optional key, but if exists, must nave number value
})

```

Currently built in modifiers:

```javascript

// The optional modifier only matters if the validator is used as the field of a shape:

V.number.optional(5) // true, but the modifier has no effect in this context.

// However, it will allow missing keys through if used on a shape field validator:

let fooValidator = V.shape({
	foo: V.string.optional,
});

fooValidator({})                // true, since the 'foo' key is missing but optional.
fooValidator({foo: ""})         // true, 'foo' key is present and has correct type.
fooValidator({foo: 10})         // false, 'foo' key is present with wrong type.
fooValidator({foo: undefined})  // false, 'foo' key is present with wrong type.
fooValidator({foo: "", bar: 0}) // true, 'foo' key has right type, extra properties are okay by default.

// The noextra modifier only matters when chained on a V.shape validator, and
// it will make the validator fail if additional keys are present in the value:

let barValidator = V.shape({
	bar: V.string.optional
}).noextra;

barValidator({})                 // true
barValidator({bar: ""})          // true
barValidator({bar: 10})          // false
barValidator({bar: "", foo: ""}) // false, additional keys not allowed, key 'foo' not specified in shape.

```

The built in modifiers are idempotent, which means you may add the modifier multiple
times and there will be no ill-effect. So

`V.shape({foo: V.string.optional.optional}).noextra.noextra`

is just the same as

`V.shape({foo: V.string.optional}).noextra`
