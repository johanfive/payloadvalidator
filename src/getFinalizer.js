const exists = require('./exists');

const getFinalizer = (expectedType, isRequired, errorKey) => ({
  receivedValue,
  receivedValueType
}) => {
  const error = {
    key: errorKey,
    message: `expected ${expectedType}, got ${receivedValueType}`
  };
  if (exists(receivedValue)) {
    error.type = 'invalid';
  } else if (isRequired) {
    error.type = 'required';
  }
  if (error.type) {
    return errorKey === 'payload'
      ? { [errorKey]: { type: error.type, message: error.message } }
      : error;
  }
  return null;
};

module.exports = getFinalizer;
