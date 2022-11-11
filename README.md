# payloadValidator

> Oh here we go... yeah buddy, the world needed another validation library...

Hear me out.

There are many libraries helping you validate that an email is an email
and a postal code is a postal code. That's great, we need those too.

But first an foremost, as API creators, we want to provide the __consumers of our APIs__ with
*predictable* and *human readable* error messages:

```json
{
  "code": 400,
  "message": "Bad request",
  "errors": {
    "payload": {
      "firstName": {
        "type": "required",
        "message": "expected string, got undefined"
      },
      "lastName": {
        "type": "invalid",
        "message": "expected string, got number"
      },
      "nested": {
        "isFun": {
          "type": "required",
          "message": "expected boolean, got undefined"
        },
        "hobbies": [
          {
            "index": 5,
            "type": "invalid",
            "message": "expected string || object, got number"
          }
        ],
      }
    }
  }
}
```

Before diving into the nitty gritty, we want to be able to simply tackle 95% of the bad requests,
without breaking a sweat.

We only want to make sure that an email is a valid email if we have an otherwise complete payload.
ie: All the required fields are populated, and whatever data we get is of the expected type.

What this library offers is a simple way to create complex validation logic on an API route
in a Node.js app.
It responds automatically to a `Bad request` with a `400` status code and **detailed** feedback.

Most importantly, embracing *middleware* philosophy, it allows you to craft *route handlers*
that *can safely assume* they will only ever be called with a *valid payload*.

You can always call additional middleware to validate the incoming payload further if you need to.
The advantage of using this library higher up the middleware stack, is that middleware functions
below it can focus on more granular validation details,
without having to worry about the presence of a value or its type.
(ie: your email validator no longer needs to check if a value is a non-null string,
it can strictly focus on the more relevant logic that makes an email an email)

Here is how it would look like if you built your API with Express:

1. Create a custom validator:
```js
// nerdValidator.js
const { createExpressValidator: createValidator, type } = require('payloadvalidator');

const nerdValidator = createValidator(type.shape({
  firstName: type.string.isRequired,
  age: type.number,
  visitedRestaurants: type.arrayOf(type.shape({
    name: type.string.isRequired,
    address: type.object,
    liked: type.boolean.isRequired,
  })).isRequired,
  favoriteRestaurants: type.arrayOf(type.string),
  noIdea: type.arrayOf(type.oneOf([ type.string, type.number ]))
}));

module.exports = nerdValidator;
```
2. Use it like you would any middleware:
```js
// server.js
const express = require('express');
const nerdValidator = require('./path/to/nerdValidator.js');

const router = express.Router();
router.post('/foodnerds', nerdValidator, (req, res) => {
  // fearless destructuring happens here
  res.send('yum');
});
```

## type
Largely inspired by the `Proptypes` library from the `React` ecosystem...
just, reduced to the bare minimum to describe a `JSON` payload.

```js
const { type } = require('payloadvalidator');
```
### type.string (and any other JSON primitives)
```js
// optional string
type.string
// required string
type.string.isRequired
```
### type.shape vs type.object
Validate the received value is an object literal of any shape:
```js
// optional object
type.object
// required object
type.object.isRequired
```
Validate the received value is an object literal of a specific shape:
```js
// optional object with required property "age" and optional property "isYoung"
type.shape({
  age: type.number.isRequired,
  isYoung: type.boolean
})
```
Complex objects:
```js
// required object with nested objects
type.shape({
  firstName: type.string.isRequired,
  address: type.shape({
    main: type.string,
    postalCode: type.string.isRequired,
  }),
  vagueOtherThings: type.object,
}).isRequired
```

### type.arrayOf vs type.array
Validate the received value is an array of elements of any type:
```js
type.array
type.array.isRequired
```
Validate the received value is an array of elements of a specific type:
```js
type.arrayOf(type.string)
```
Complex arrays:
```js
// required array of arrays [[], [], []]
type.arrayOf(type.array).isRequired
```
```js
// optional array of arrays of objects
// [
//   [{ nested: [{}], arrays: [] }],
//   [{ nested: [{}], arrays: [] }, { nested: [{}], arrays: [] }]
// ]
type.arrayOf(type.arrayOf(type.shape({
  nested: type.arrayOf(type.object),
  arrays: type.array,
})))
```

### type.oneOf
```js
// Either a string or a number
type.oneOf([type.string, type.number])
```

Complex array example with oneOf:
```js
// [
//   { "prop1": "val1" },
//   5,
//   true,
//   "if that's really what you want..."
// ]
type.arrayOf(type.oneOf([
  type.shape({ prop1: type.string }),
  type.number,
  type.boolean,
  type.string,
]));
```

If you need to guarantee the type of an element at a specific index within the array,
you might want to reconsider your API specs first.

The library does not offer a `type.any` as it would go __against__ its design philosophy.
But if you must, there are ways...

The library does not offer a `type.exact`. Instead of forcing the consumers of your API
to provide an exact value, consider setting __defaults__ in your API code.

The `single concern` of this library is a value's `type`, __not__ the value __itself__.
It cannot help you validate that a value is either a 5 or an 8, solely that it is indeed a number.

## Advanced
> I'm actually interested, but I don't use Express
### createFrameworkValidator

As long as the framework you work with has a clearly defined middleware signature, you can make your own validators generator with `createFrameworkValidator`.

Express middleware functions have the following signature: `(req, res, next) => {}`

So here is how `createExpressValidator` is made under the hood:
```js
const createExpressValidator = (typeDefinitions) => (req, res, next) => createFrameworkValidator({
  validate: typeDefinitions,
  payload: req.body,
  handleBadRequest: (error) => res.status(error.code).send(error),
  handleValidRequest: next,
});
```

This means to make `createMyOwnValidator` you will write something like this:
```js
const { createFrameworkValidator } = require('payloadvalidator');

/**
 * @param {*} typeDefinitions ex: type.shape({ firstName: type.string }).isRequired
 * @returns {Function} A middleware function
 */
const createMyOwnValidator = (typeDefinitions) => {
  // here "todo" is a placeholder
  // for whatever the signature of a middleware function is
  // in the framework that you work with
  return function middleware(todo) {
    return createFrameworkValidator({
      validate: typeDefinitions,
      payload: todo, // retrieve the payload from the request the way your framework dictates
      handleBadRequest: (error) => {
        // const { code, message, errors } = error;
        todo; // send response and end the request the way your framework dictates
      }, // called if payload is invalid
      handleValidRequest: todo, // the next middleware or route handler to be called if a payload is valid
    });
  };
};

module.exports = createMyOwnValidator;
```
Which you would use like:
```js
const createMyOwnValidator = require('./path/to/createMyOwnValidator.js');

const myThingValidator = createMyOwnValidator(type.shape({
  myProp1: type.string,
  myProp2: type.number,
  etc: type.arrayOf(type.object)
}));
// and then just plug the myThingValidator middleware in the routes that need gatekeeping
// the way your framework dictates
```
