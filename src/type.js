const { jsonType } = require('./constants');
const getTypeChecker = require('./getTypeChecker');
const arrayOf = require('./arrayOf');
const oneOf = require('./oneOf');
const shape = require('./shape');

const type = {};
type.boolean = getTypeChecker(jsonType.BOOLEAN);
type.number = getTypeChecker(jsonType.NUMBER);
type.oneOf = oneOf;
type.string = getTypeChecker(jsonType.STRING);
/**
 * Array of elements of ANY type
 */
type.array = getTypeChecker(jsonType.ARRAY);
/**
 * Array of elements of A SPECIFIC type
 */
type.arrayOf = arrayOf;
/**
 * Object literal of ANY shape
 */
type.object = getTypeChecker(jsonType.OBJECT);
/**
 * Object literal of A SPECIFIC shape
 */
type.shape = shape;

module.exports = type;
