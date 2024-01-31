const { receivedPayloadKey } = require('./constants');
const exists = require('./exists');
const getPreciseType = require('./getPreciseType');

const deriveMeaningfulData = (payload, prop) => {
  const receivedValue = exists(prop) ? payload[prop] : payload;
  const receivedValueType = getPreciseType(receivedValue);
  const errorKey = prop === 0 ? 0 : (prop || receivedPayloadKey);
  return {
    receivedValue,
    receivedValueType,
    errorKey
  };
};

module.exports = deriveMeaningfulData;
