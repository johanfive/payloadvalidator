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
  // describe('shape', () => {});
  // describe('arrayOf', () => {});
  // describe('oneOf', () => {});
});