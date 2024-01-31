const { jsonType, errorMsg, receivedPayloadKey } = require('./constants');
const deriveMeaningfulData = require('./deriveMeaningfulData');
const exists = require('./exists');
const getFinalizer = require('./getFinalizer');
const getPreciseType = require('./getPreciseType');
const makeRequirable = require('./makeRequirable');

const shape = (typeDefinitions) => {
  if (getPreciseType(typeDefinitions) !== jsonType.OBJECT) {
    throw new Error(errorMsg.shape.badConfig);
  }
  const typeChecker = (isRequired, payload, prop) => {
    const { receivedValue, receivedValueType, errorKey } = deriveMeaningfulData(payload, prop);
    if (receivedValueType === jsonType.OBJECT) {
      const errors = {};
      Object.entries(typeDefinitions).forEach(([key, validator]) => {
        if (getPreciseType(validator) !== 'function') {
          throw new Error(errorMsg.shape.badConfig);
        }
        const e = exists(prop) ? validator(payload[prop], key) : validator(payload, key);
        if (e) {
          errors[e.key] = e.arrayErrors || e.objectErrors || { type: e.type, message: e.message };
        }
      });
      if (Object.keys(errors).length > 0) {
        return (errorKey === receivedPayloadKey)
          ? { [errorKey]: errors }
          : { key: errorKey, objectErrors: errors };
      }
      return null;
    }
    const objectFinalChecks = getFinalizer(jsonType.OBJECT, isRequired, errorKey);
    return objectFinalChecks({ receivedValue, receivedValueType });
  };
  return makeRequirable(typeChecker, 'shape');
};

module.exports = shape;
