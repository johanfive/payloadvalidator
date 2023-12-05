const type = require('./type');

const createFrameworkValidator = ({ validate, payload, handleBadRequest, handleValidRequest }) => {
  const errors = validate(payload);
  const error = { code: 400, message: 'Bad request', errors };
  return errors ? handleBadRequest(error) : handleValidRequest();
};

const createExpressValidator = (typeDefinitions) => (req, res, next) => createFrameworkValidator({
  validate: typeDefinitions,
  payload: req.body,
  handleBadRequest: (error) => res.status(error.code).send(error),
  handleValidRequest: next
});

module.exports = {
  type,
  express: {
    type,
    createValidator: createExpressValidator
  },
  createFrameworkValidator
};
