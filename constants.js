module.exports = {
  jsonType: {
    STRING: 'string',
    NUMBER: 'number',
    BOOLEAN: 'boolean',
    OBJECT: 'object',
    ARRAY: 'array',
    NULL: 'null',
  },
  errorMsg: {
    oneOf: {
      badConfig: 'Unclear configuration: try something like "type.oneOf([ type.string, type.number ]) instead',
      notEnoughTypeDefs: 'type.oneOf([ ... ]) needs at least 2 type definitions to work, otherwise just use a precise type definition such as "type.string" instead',
      noNesting: 'Do not nest oneOf directly inside another oneOf',
    },
    shape: {
      badConfig: 'Unclear configuration: try something like "type.shape({ prop: type.string }) instead',
    }
  },
};
