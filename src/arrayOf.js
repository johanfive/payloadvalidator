const { jsonType, receivedPayloadKey } = require('./constants');
const deriveMeaningfulData = require('./deriveMeaningfulData');
const getFinalizer = require('./getFinalizer');
const getPreciseType = require('./getPreciseType');
const makeRequirable = require('./makeRequirable');

const arrayOf = (validator) => {
  const validatorType = getPreciseType(validator);
  if (validatorType !== 'function') {
    let errorMsg = 'Unclear configuration: try "type.arrayOf(type.';
    switch (validatorType) {
      case jsonType.OBJECT:
        errorMsg += 'shape({}))" or "type.arrayOf(type.object)" instead';
        break;
      case jsonType.ARRAY:
        errorMsg += 'arrayOf(type.string))" or "type.arrayOf(type.array)" instead';
        break;
      case jsonType.STRING:
        errorMsg += 'string)" instead';
        break;
      case jsonType.BOOLEAN:
        errorMsg += 'boolean)" instead';
        break;
      case jsonType.NUMBER:
        errorMsg += 'number)" instead';
        break;

      default:
        errorMsg = 'Missing configuration parameters for type.arrayOf()';
        break;
    }
    throw new Error(errorMsg);
  }

  const typeChecker = (isRequired, payload, prop) => {
    const { receivedValue, receivedValueType, errorKey } = deriveMeaningfulData(payload, prop);
    if (receivedValueType === jsonType.ARRAY) {
      const errors = [];
      for (let i = 0; i < receivedValue.length; i++) {
        const e = validator(receivedValue, i);
        if (e) {
          const error = e.arrayErrors || e.objectErrors || { type: e.type, message: e.message };
          errors.push({ index: e.key, ...error });
        }
      }
      if (errors.length > 0) {
        return (errorKey === receivedPayloadKey)
          ? { [errorKey]: errors }
          : { key: errorKey, arrayErrors: errors };
      }
      return null;
    }
    const arrayFinalChecks = getFinalizer(jsonType.ARRAY, isRequired, errorKey);
    return arrayFinalChecks({ receivedValue, receivedValueType });
  };
  return makeRequirable(typeChecker, jsonType.ARRAY);
};

module.exports = arrayOf;
