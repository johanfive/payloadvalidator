const deriveMeaningfulData = require('./deriveMeaningfulData');
const getFinalizer = require('./getFinalizer');
const makeRequirable = require('./makeRequirable');

const getTypeChecker = (expectedType) => {
  const typeChecker = (isRequired, payload, prop) => {
    const { receivedValue, receivedValueType, errorKey } = deriveMeaningfulData(payload, prop);
    if (receivedValueType === expectedType) {
      return null;
    }
    const finalChecks = getFinalizer(expectedType, isRequired, errorKey);
    return finalChecks({ receivedValue, receivedValueType });
  };
  return makeRequirable(typeChecker, expectedType);
};

module.exports = getTypeChecker;
