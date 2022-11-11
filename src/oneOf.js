const { jsonType, errorMsg } = require('./constants');
const deriveMeaningfulData = require('./deriveMeaningfulData');
const exists = require('./exists');
const getFinalizer = require('./getFinalizer');
const getPreciseType = require('./getPreciseType');
const makeRequirable = require('./makeRequirable');

const oneOf = (typeDefinitions) => {
  if (getPreciseType(typeDefinitions) !== jsonType.ARRAY) {
    throw new Error(errorMsg.oneOf.badConfig);
  }
  if (typeDefinitions.length < 2) {
    throw new Error(errorMsg.oneOf.notEnoughTypeDefs);
  }
  const typeChecker = (isRequired, payload, prop) => {
    const { receivedValue, receivedValueType, errorKey } = deriveMeaningfulData(payload, prop);
    const expected = [];
    for (let i = 0; i < typeDefinitions.length; i++) {
      const validator = typeDefinitions[i];
      if (validator.type === 'oneOf') {
        throw new Error(errorMsg.oneOf.noNesting);
      }
      if (getPreciseType(validator) !== 'function') {
        throw new Error(errorMsg.oneOf.badConfig);
      }
      expected.push(validator.type);
      const e = validator(receivedValue);
      if (!e && !(isRequired && !exists(receivedValue))) {
        return null;
      }
    }
    const expectedType = expected.join(' || ');
    const oneOfFinalChecks = getFinalizer(expectedType, isRequired, errorKey);
    return oneOfFinalChecks({ receivedValue, receivedValueType });
  };
  return makeRequirable(typeChecker, 'oneOf');
};

module.exports = oneOf;
