const { receivedPayloadKey, errorTypes } = require('./constants');
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
    error.type = errorTypes.INVALID;
  } else if (isRequired) {
    error.type = errorTypes.MISSING;
  }
  if (error.type) {
    return errorKey === receivedPayloadKey
      ? { [errorKey]: { type: error.type, message: error.message } }
      : error;
  }
  return null;
};

module.exports = getFinalizer;
