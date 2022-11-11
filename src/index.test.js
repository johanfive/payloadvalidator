const { createExpressValidator, type } = require('.');

let req;
let next;
let send;
let status;
let res;
let validator;
let expectedRes;
beforeEach(() => {
  req = { body: {} };
  next = jest.fn();
  send = jest.fn();
  status = jest.fn(() => ({ send }));
  res = { send, status };
  validator = null;
  expectedRes = {
    code: 400,
    errors: {
      payload: {
        type: 'invalid',
        message: ''
      }
    },
    message: 'Bad request'
  };
});

const confirmHappyPath = () => {
  validator(req, res, next);
  expect(next).toHaveBeenCalled();
  expect(status).not.toHaveBeenCalled();
  expect(send).not.toHaveBeenCalled();
};

const confirmBomb = () => {
  validator(req, res, next);
  expect(next).not.toHaveBeenCalled();
  expect(status).toHaveBeenCalledWith(400);
  expect(send).toHaveBeenCalledWith(expectedRes);
};

describe('An Express payload validator is configured to expect', () => {
  describe('an optional string.', () => {
    beforeEach(() => {
      validator = createExpressValidator(type.string);
    });
    describe('The next handler should be called when the incoming payload is', () => {
      test('a string', () => {
        req.body = '';
        confirmHappyPath();
      });
      test('undefined', () => {
        req = {};
        confirmHappyPath();
      });
      test('null', () => {
        req.body = null;
        confirmHappyPath();
      });
    });
    describe('A "400 - Bad Request" response should be sent when the incoming payload is', () => {
      test('a number', () => {
        req.body = 0;
        expectedRes.errors.payload.message = 'expected string, got number';
        confirmBomb();
      });
      test('a boolean', () => {
        req.body = false;
        expectedRes.errors.payload.message = 'expected string, got boolean';
        confirmBomb();
      });
      test('an object', () => {
        expectedRes.errors.payload.message = 'expected string, got object';
        confirmBomb();
      });
      test('an array', () => {
        req.body = [];
        expectedRes.errors.payload.message = 'expected string, got array';
        confirmBomb();
      });
    });
  });
  describe('a required string.', () => {
    beforeEach(() => {
      validator = createExpressValidator(type.string.isRequired);
    });
    describe('The next handler should be called when the incoming payload is', () => {
      test('a string', () => {
        req.body = '';
        confirmHappyPath();
      });
    });
    describe('A "400 - Bad Request" response should be sent when the incoming payload is', () => {
      test('undefined', () => {
        req = {};
        expectedRes.errors.payload.type = 'required';
        expectedRes.errors.payload.message = 'expected string, got undefined';
        confirmBomb();
      });
      test('null', () => {
        req.body = null;
        expectedRes.errors.payload.type = 'required';
        expectedRes.errors.payload.message = 'expected string, got null';
        confirmBomb();
      });
      test('a number', () => {
        req.body = 0;
        expectedRes.errors.payload.message = 'expected string, got number';
        confirmBomb();
      });
      test('a boolean', () => {
        req.body = false;
        expectedRes.errors.payload.message = 'expected string, got boolean';
        confirmBomb();
      });
      test('an object', () => {
        expectedRes.errors.payload.message = 'expected string, got object';
        confirmBomb();
      });
      test('an array', () => {
        req.body = [];
        expectedRes.errors.payload.message = 'expected string, got array';
        confirmBomb();
      });
    });
  });

  describe('an optional number.', () => {
    beforeEach(() => {
      validator = createExpressValidator(type.number);
    });
    describe('The next handler should be called when the incoming payload is', () => {
      test('a number', () => {
        req.body = 0;
        confirmHappyPath();
      });
      test('undefined', () => {
        req = {};
        confirmHappyPath();
      });
      test('null', () => {
        req.body = null;
        confirmHappyPath();
      });
    });
    describe('A "400 - Bad Request" response should be sent when the incoming payload is', () => {
      test('a string', () => {
        req.body = '';
        expectedRes.errors.payload.message = 'expected number, got string';
        confirmBomb();
      });
      test('a boolean', () => {
        req.body = false;
        expectedRes.errors.payload.message = 'expected number, got boolean';
        confirmBomb();
      });
      test('an object', () => {
        expectedRes.errors.payload.message = 'expected number, got object';
        confirmBomb();
      });
      test('an array', () => {
        req.body = [];
        expectedRes.errors.payload.message = 'expected number, got array';
        confirmBomb();
      });
    });
  });
  describe('a required number.', () => {
    beforeEach(() => {
      validator = createExpressValidator(type.number.isRequired);
    });
    describe('The next handler should be called when the incoming payload is', () => {
      test('a number', () => {
        req.body = 0;
        confirmHappyPath();
      });
    });
    describe('A "400 - Bad Request" response should be sent when the incoming payload is', () => {
      test('undefined', () => {
        req = {};
        expectedRes.errors.payload.type = 'required';
        expectedRes.errors.payload.message = 'expected number, got undefined';
        confirmBomb();
      });
      test('null', () => {
        req.body = null;
        expectedRes.errors.payload.type = 'required';
        expectedRes.errors.payload.message = 'expected number, got null';
        confirmBomb();
      });
      test('a string', () => {
        req.body = '';
        expectedRes.errors.payload.message = 'expected number, got string';
        confirmBomb();
      });
      test('a boolean', () => {
        req.body = false;
        expectedRes.errors.payload.message = 'expected number, got boolean';
        confirmBomb();
      });
      test('an object', () => {
        expectedRes.errors.payload.message = 'expected number, got object';
        confirmBomb();
      });
      test('an array', () => {
        req.body = [];
        expectedRes.errors.payload.message = 'expected number, got array';
        confirmBomb();
      });
    });
  });

  describe('an optional boolean.', () => {
    beforeEach(() => {
      validator = createExpressValidator(type.boolean);
    });
    describe('The next handler should be called when the incoming payload is', () => {
      test('a boolean', () => {
        req.body = false;
        confirmHappyPath();
      });
      test('undefined', () => {
        req = {};
        confirmHappyPath();
      });
      test('null', () => {
        req.body = null;
        confirmHappyPath();
      });
    });
    describe('A "400 - Bad Request" response should be sent when the incoming payload is', () => {
      test('a string', () => {
        req.body = '';
        expectedRes.errors.payload.message = 'expected boolean, got string';
        confirmBomb();
      });
      test('a number', () => {
        req.body = 0;
        expectedRes.errors.payload.message = 'expected boolean, got number';
        confirmBomb();
      });
      test('an object', () => {
        expectedRes.errors.payload.message = 'expected boolean, got object';
        confirmBomb();
      });
      test('an array', () => {
        req.body = [];
        expectedRes.errors.payload.message = 'expected boolean, got array';
        confirmBomb();
      });
    });
  });
  describe('a required boolean.', () => {
    beforeEach(() => {
      validator = createExpressValidator(type.boolean.isRequired);
    });
    describe('The next handler should be called when the incoming payload is', () => {
      test('a boolean', () => {
        req.body = false;
        confirmHappyPath();
      });
    });
    describe('A "400 - Bad Request" response should be sent when the incoming payload is', () => {
      test('undefined', () => {
        req = {};
        expectedRes.errors.payload.type = 'required';
        expectedRes.errors.payload.message = 'expected boolean, got undefined';
        confirmBomb();
      });
      test('null', () => {
        req.body = null;
        expectedRes.errors.payload.type = 'required';
        expectedRes.errors.payload.message = 'expected boolean, got null';
        confirmBomb();
      });
      test('a string', () => {
        req.body = '';
        expectedRes.errors.payload.message = 'expected boolean, got string';
        confirmBomb();
      });
      test('a number', () => {
        req.body = 0;
        expectedRes.errors.payload.message = 'expected boolean, got number';
        confirmBomb();
      });
      test('an object', () => {
        expectedRes.errors.payload.message = 'expected boolean, got object';
        confirmBomb();
      });
      test('an array', () => {
        req.body = [];
        expectedRes.errors.payload.message = 'expected boolean, got array';
        confirmBomb();
      });
    });
  });

  describe('an optional array.', () => {
    beforeEach(() => {
      validator = createExpressValidator(type.array);
    });
    describe('The next handler should be called when the incoming payload is', () => {
      test('an array', () => {
        req.body = [];
        confirmHappyPath();
      });
      test('undefined', () => {
        req = {};
        confirmHappyPath();
      });
      test('null', () => {
        req.body = null;
        confirmHappyPath();
      });
    });
    describe('A "400 - Bad Request" response should be sent when the incoming payload is', () => {
      test('a string', () => {
        req.body = '';
        expectedRes.errors.payload.message = 'expected array, got string';
        confirmBomb();
      });
      test('a number', () => {
        req.body = 0;
        expectedRes.errors.payload.message = 'expected array, got number';
        confirmBomb();
      });
      test('an object', () => {
        expectedRes.errors.payload.message = 'expected array, got object';
        confirmBomb();
      });
      test('a boolean', () => {
        req.body = false;
        expectedRes.errors.payload.message = 'expected array, got boolean';
        confirmBomb();
      });
    });
  });
  describe('a required array.', () => {
    beforeEach(() => {
      validator = createExpressValidator(type.array.isRequired);
    });
    describe('The next handler should be called when the incoming payload is', () => {
      test('an array', () => {
        req.body = [];
        confirmHappyPath();
      });
    });
    describe('A "400 - Bad Request" response should be sent when the incoming payload is', () => {
      test('undefined', () => {
        req = {};
        expectedRes.errors.payload.type = 'required';
        expectedRes.errors.payload.message = 'expected array, got undefined';
        confirmBomb();
      });
      test('null', () => {
        req.body = null;
        expectedRes.errors.payload.type = 'required';
        expectedRes.errors.payload.message = 'expected array, got null';
        confirmBomb();
      });
      test('a string', () => {
        req.body = '';
        expectedRes.errors.payload.message = 'expected array, got string';
        confirmBomb();
      });
      test('a number', () => {
        req.body = 0;
        expectedRes.errors.payload.message = 'expected array, got number';
        confirmBomb();
      });
      test('an object', () => {
        expectedRes.errors.payload.message = 'expected array, got object';
        confirmBomb();
      });
      test('a boolean', () => {
        req.body = false;
        expectedRes.errors.payload.message = 'expected array, got boolean';
        confirmBomb();
      });
    });
  });

  describe('an optional object.', () => {
    beforeEach(() => {
      validator = createExpressValidator(type.object);
    });
    describe('The next handler should be called when the incoming payload is', () => {
      test('an object', () => {
        confirmHappyPath();
      });
      test('undefined', () => {
        req = {};
        confirmHappyPath();
      });
      test('null', () => {
        req.body = null;
        confirmHappyPath();
      });
    });
    describe('A "400 - Bad Request" response should be sent when the incoming payload is', () => {
      test('a string', () => {
        req.body = '';
        expectedRes.errors.payload.message = 'expected object, got string';
        confirmBomb();
      });
      test('a number', () => {
        req.body = 0;
        expectedRes.errors.payload.message = 'expected object, got number';
        confirmBomb();
      });
      test('an array', () => {
        req.body = [];
        expectedRes.errors.payload.message = 'expected object, got array';
        confirmBomb();
      });
      test('a boolean', () => {
        req.body = false;
        expectedRes.errors.payload.message = 'expected object, got boolean';
        confirmBomb();
      });
    });
  });
  describe('a required object.', () => {
    beforeEach(() => {
      validator = createExpressValidator(type.object.isRequired);
    });
    describe('The next handler should be called when the incoming payload is', () => {
      test('an object', () => {
        confirmHappyPath();
      });
    });
    describe('A "400 - Bad Request" response should be sent when the incoming payload is', () => {
      test('undefined', () => {
        req = {};
        expectedRes.errors.payload.type = 'required';
        expectedRes.errors.payload.message = 'expected object, got undefined';
        confirmBomb();
      });
      test('null', () => {
        req.body = null;
        expectedRes.errors.payload.type = 'required';
        expectedRes.errors.payload.message = 'expected object, got null';
        confirmBomb();
      });
      test('a string', () => {
        req.body = '';
        expectedRes.errors.payload.message = 'expected object, got string';
        confirmBomb();
      });
      test('a number', () => {
        req.body = 0;
        expectedRes.errors.payload.message = 'expected object, got number';
        confirmBomb();
      });
      test('an array', () => {
        req.body = [];
        expectedRes.errors.payload.message = 'expected object, got array';
        confirmBomb();
      });
      test('a boolean', () => {
        req.body = false;
        expectedRes.errors.payload.message = 'expected object, got boolean';
        confirmBomb();
      });
    });
  });

  describe('an optional shape', () => {
    beforeEach(() => {
      validator = createExpressValidator(type.shape({
        string: type.string.isRequired,
        number: type.number,
        boolean: type.boolean,
        array: type.array,
        object: type.object,
        arrayOf: type.arrayOf(type.string.isRequired),
        oneOf: type.oneOf([type.string, type.number]),
        shape: type.shape({ string: type.string })
      }));
    });
    describe('The next handler should be called when the incoming payload is', () => {
      test('an object whose properties match the typeDefinitions', () => {
        req.body = { string: 'string', shape: { string: '' } };
        confirmHappyPath();
      });
      test('undefined', () => {
        req = {};
        confirmHappyPath();
      });
      test('null', () => {
        req.body = null;
        confirmHappyPath();
      });
    });
    describe('A "400 - Bad Request" response should be sent when the incoming payload is', () => {
      test('an object whose properties do not match the typeDefinitions', () => {
        req.body = {
          number: '5',
          boolean: 0,
          array: {},
          object: [],
          arrayOf: [0, false,, null],
          oneOf: false,
          shape: { string: [] }
        };
        expectedRes.errors.payload = {
          string: {
            type: 'required',
            message: 'expected string, got undefined'
          },
          number: {
            type: 'invalid',
            message: 'expected number, got string'
          },
          array: {
            type: 'invalid',
            message: 'expected array, got object',
          },
          arrayOf: [
            {
              index: 0,
              type: 'invalid',
              message: 'expected string, got number',
            },
            {
              index: 1,
              type: 'invalid',
              message: 'expected string, got boolean',
            },
            {
              index: 2,
              type: 'required',
              message: 'expected string, got undefined',
            },
            {
              index: 3,
              type: 'required',
              message: 'expected string, got null',
            }
          ],
          boolean: {
            type: 'invalid',
            message: 'expected boolean, got number',
          },
          object: {
            type: 'invalid',
            message: 'expected object, got array',
          },
          oneOf: {
            type: 'invalid',
            message: 'expected string || number, got boolean',
          },
          shape: {
            string: {
              type: 'invalid',
              message: 'expected string, got array'
            }
          }
        };
        confirmBomb();
      });
      test('a string', () => {
        req.body = '';
        expectedRes.errors.payload.message = 'expected object, got string';
        confirmBomb();
      });
      test('a number', () => {
        req.body = 0;
        expectedRes.errors.payload.message = 'expected object, got number';
        confirmBomb();
      });
      test('an array', () => {
        req.body = [];
        expectedRes.errors.payload.message = 'expected object, got array';
        confirmBomb();
      });
      test('a boolean', () => {
        req.body = false;
        expectedRes.errors.payload.message = 'expected object, got boolean';
        confirmBomb();
      });
    });
  });
  describe('a required shape.', () => {
    beforeEach(() => {
      validator = createExpressValidator(type.shape({
        string: type.string.isRequired,
        number: type.number,
        boolean: type.boolean,
        array: type.array,
        object: type.object,
        arrayOf: type.arrayOf(type.string),
        oneOf: type.oneOf([type.string, type.number]),
        shape: type.shape({})
      }).isRequired);
    });
    describe('The next handler should be called when the incoming payload is', () => {
      test('an object whose properties match the typeDefinitions', () => {
        req.body = {
          string: 'string',
          number: 5,
          boolean: true,
          array: [],
          object: {},
          arrayOf: ['string'],
          oneOf: 'string',
          shape: {}
        };
        confirmHappyPath();
      });
    });
    describe('A "400 - Bad Request" response should be sent when the incoming payload is', () => {
      test('undefined', () => {
        req = {};
        expectedRes.errors.payload.type = 'required';
        expectedRes.errors.payload.message = 'expected object, got undefined';
        confirmBomb();
      });
      test('null', () => {
        req.body = null;
        expectedRes.errors.payload.type = 'required';
        expectedRes.errors.payload.message = 'expected object, got null';
        confirmBomb();
      });
      test('an object whose properties do not match the typeDefinitions', () => {
        expectedRes.errors.payload = {
          string: {
            type: 'required',
            message: 'expected string, got undefined'
          }
        };
        confirmBomb();
      });
      test('a string', () => {
        req.body = '';
        expectedRes.errors.payload.message = 'expected object, got string';
        confirmBomb();
      });
      test('a number', () => {
        req.body = 0;
        expectedRes.errors.payload.message = 'expected object, got number';
        confirmBomb();
      });
      test('an array', () => {
        req.body = [];
        expectedRes.errors.payload.message = 'expected object, got array';
        confirmBomb();
      });
      test('a boolean', () => {
        req.body = false;
        expectedRes.errors.payload.message = 'expected object, got boolean';
        confirmBomb();
      });
    });
  });

  describe('an optional array of optional strings.', () => {
    beforeEach(() => {
      validator = createExpressValidator(type.arrayOf(type.string));
    });
    describe('The next handler should be called when the incoming payload is', () => {
      test('an array of elements that match the type definition', () => {
        req.body = ['',, null];
        confirmHappyPath();
      });
      test('an empty array', () => {
        req.body = [];
        confirmHappyPath();
      });
      test('undefined', () => {
        req = {};
        confirmHappyPath();
      });
      test('null', () => {
        req.body = null;
        confirmHappyPath();
      });
    });
    describe('A "400 - Bad Request" response should be sent when the incoming payload is', () => {
      test('an array of elements that do not match the type definition', () => {
        req.body = [0, false, {}, []];
        expectedRes.errors.payload = [
          {
            index: 0,
            type: 'invalid',
            message: 'expected string, got number'
          },
          {
            index: 1,
            message: 'expected string, got boolean',
            type: 'invalid',
          },
          {
            index: 2,
            message: 'expected string, got object',
            type: 'invalid',
          },
          {
            index: 3,
            message: 'expected string, got array',
            type: 'invalid',
          },
        ];
        confirmBomb();
      });
      test('a string', () => {
        req.body = '';
        expectedRes.errors.payload.message = 'expected array, got string';
        confirmBomb();
      });
      test('a number', () => {
        req.body = 0;
        expectedRes.errors.payload.message = 'expected array, got number';
        confirmBomb();
      });
      test('an object', () => {
        req.body = {};
        expectedRes.errors.payload.message = 'expected array, got object';
        confirmBomb();
      });
      test('a boolean', () => {
        req.body = false;
        expectedRes.errors.payload.message = 'expected array, got boolean';
        confirmBomb();
      });
    });
  });
  describe('a required array of required strings.', () => {
    beforeEach(() => {
      validator = createExpressValidator(type.arrayOf(type.string.isRequired).isRequired);
    });
    describe('The next handler should be called when the incoming payload is', () => {
      test('an array of elements that match the type definition', () => {
        req.body = [''];
        confirmHappyPath();
      });
      test('an empty array', () => {
        req.body = [];
        confirmHappyPath();
      });
    });
    describe('A "400 - Bad Request" response should be sent when the incoming payload is', () => {
      test('an array of elements that do not match the type definition', () => {
        req.body = ['',, null];
        expectedRes.errors.payload = [
          {
            index: 1,
            type: 'required',
            message: 'expected string, got undefined',
                  },
          {
            index: 2,
            type: 'required',
            message: 'expected string, got null',
          },
        ];
        confirmBomb();
      });
      test('undefined', () => {
        req = {};
        expectedRes.errors.payload.type = 'required';
        expectedRes.errors.payload.message = 'expected array, got undefined';
        confirmBomb();
      });
      test('null', () => {
        req.body = null;
        expectedRes.errors.payload.type = 'required';
        expectedRes.errors.payload.message = 'expected array, got null';
        confirmBomb();
      });
      test('a string', () => {
        req.body = '';
        expectedRes.errors.payload.message = 'expected array, got string';
        confirmBomb();
      });
      test('a number', () => {
        req.body = 0;
        expectedRes.errors.payload.message = 'expected array, got number';
        confirmBomb();
      });
      test('an object', () => {
        req.body = {};
        expectedRes.errors.payload.message = 'expected array, got object';
        confirmBomb();
      });
      test('a boolean', () => {
        req.body = false;
        expectedRes.errors.payload.message = 'expected array, got boolean';
        confirmBomb();
      });
    });
  });

  describe('an optional oneOf string and number.', () => {
    beforeEach(() => {
      validator = createExpressValidator(type.oneOf([type.string, type.number]));
    });
    describe('The next handler should be called when the incoming payload is', () => {
      test('a string', () => {
        req.body = '';
        confirmHappyPath();
      });
      test('a number', () => {
        req.body = 0;
        confirmHappyPath();
      });
      test('undefined', () => {
        req = {};
        confirmHappyPath();
      });
      test('null', () => {
        req.body = null;
        confirmHappyPath();
      });
    });
    describe('A "400 - Bad Request" response should be sent when the incoming payload is', () => {
      test('an array', () => {
        req.body = [];
        expectedRes.errors.payload.message = 'expected string || number, got array';
        confirmBomb();
      });
      test('an object', () => {
        req.body = {};
        expectedRes.errors.payload.message = 'expected string || number, got object';
        confirmBomb();
      });
      test('a boolean', () => {
        req.body = false;
        expectedRes.errors.payload.message = 'expected string || number, got boolean';
        confirmBomb();
      });
    });
  });
  describe('a required oneOf string and number.', () => {
    beforeEach(() => {
      validator = createExpressValidator(type.oneOf([type.string, type.number]).isRequired);
    });
    describe('The next handler should be called when the incoming payload is', () => {
      test('a string', () => {
        req.body = '';
        confirmHappyPath();
      });
      test('a number', () => {
        req.body = 0;
        confirmHappyPath();
      });
    });
    describe('A "400 - Bad Request" response should be sent when the incoming payload is', () => {
      test('undefined', () => {
        req = {};
        expectedRes.errors.payload.type = 'required';
        expectedRes.errors.payload.message = 'expected string || number, got undefined';
        confirmBomb();
      });
      test('null', () => {
        req.body = null;
        expectedRes.errors.payload.type = 'required';
        expectedRes.errors.payload.message = 'expected string || number, got null';
        confirmBomb();
      });
      test('an object', () => {
        req.body = {};
        expectedRes.errors.payload.message = 'expected string || number, got object';
        confirmBomb();
      });
      test('an array', () => {
        req.body = [];
        expectedRes.errors.payload.message = 'expected string || number, got array';
        confirmBomb();
      });
      test('a boolean', () => {
        req.body = false;
        expectedRes.errors.payload.message = 'expected string || number, got boolean';
        confirmBomb();
      });
    });
  });
});

describe('Library throws errors when', () => {
  describe('type.shape', () => {
    test('is not called with an object literal', () => {
      expect(() => createExpressValidator(type.shape([]))).toThrowErrorMatchingSnapshot();
    });
    test('has a property that is not a typeDefinition', () => {
      validator = createExpressValidator(type.shape({ should: 'kaboom' }));
      req.body = { should: 'kaboom' };
      expect(() => validator(req, res, next)).toThrowErrorMatchingSnapshot();
    });
  });
  describe('type.oneOf', () => {
    test('is not called with an array', () => {
      expect(() => createExpressValidator(type.oneOf(type.string))).toThrowErrorMatchingSnapshot();
    });
    test('is called with an array of less than 2 elements', () => {
      expect(() => createExpressValidator(type.oneOf([type.string]))).toThrowErrorMatchingSnapshot();
    });
    test('has an element that is not a typeDefinition', () => {
      validator = createExpressValidator(type.oneOf(['should', 'kaboom' ]));
      req.body = ['should', 'kaboom'];
      expect(() => validator(req, res, next)).toThrowErrorMatchingSnapshot();
    });
    test('has an element that is also a type.oneOf', () => {
      validator = createExpressValidator(type.oneOf([
        type.string,
        type.oneOf([type.string, type.number])
      ]));
      req.body = ['should', 'kaboom'];
      expect(() => validator(req, res, next)).toThrowErrorMatchingSnapshot();
    });
  });
  describe('type.arrayOf', () => {
    test('is called with an object', () => {
      expect(() => createExpressValidator(type.arrayOf({ kaboom: type.string }))).toThrowErrorMatchingSnapshot();
    });
    test('is called with an array', () => {
      expect(() => createExpressValidator(type.arrayOf([type.string]))).toThrowErrorMatchingSnapshot();
    });
    test('is called with a string', () => {
      expect(() => createExpressValidator(type.arrayOf('string'))).toThrowErrorMatchingSnapshot();
    });
    test('is called with a boolean', () => {
      expect(() => createExpressValidator(type.arrayOf(true))).toThrowErrorMatchingSnapshot();
    });
    test('is called with a number', () => {
      expect(() => createExpressValidator(type.arrayOf(5))).toThrowErrorMatchingSnapshot();
    });
    test('is called with a null', () => {
      expect(() => createExpressValidator(type.arrayOf(null))).toThrowErrorMatchingSnapshot();
    });
    test('is called with nothing', () => {
      expect(() => createExpressValidator(type.arrayOf())).toThrowErrorMatchingSnapshot();
    });
  });
});