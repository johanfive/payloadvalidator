const { jsonType } = require('./constants');

const getPreciseType = (data) => {
  const type = typeof data;
  if (type === jsonType.OBJECT) {
    if (data) {
      return Array.isArray(data) ? jsonType.ARRAY : jsonType.OBJECT;
    }
    return jsonType.NULL;
  }
  return type;
};

module.exports = getPreciseType;
