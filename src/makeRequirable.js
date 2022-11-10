const makeRequirable = (typeChecker, type) => {
  const requirable = typeChecker.bind(null, false);
  requirable.isRequired = typeChecker.bind(null, true);
  requirable.type = type;
  requirable.isRequired.type = type;
  return requirable;
};

module.exports = makeRequirable;
