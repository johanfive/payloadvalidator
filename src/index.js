const { receivedPayloadKey } = require('./constants');
const type = require('./type');

const createFrameworkValidator = ({ validate, payload, handleBadRequest, handleValidRequest }) => {
  const errors = validate(payload);
  if (errors) {
    const error = { status: 400, message: 'Bad request', errors: errors[receivedPayloadKey] };
    return handleBadRequest(error);
  }
  handleValidRequest();
};

const createExpressValidator = (typeDefinitions) => (req, res, next) => createFrameworkValidator({
  validate: typeDefinitions,
  payload: req.body,
  handleBadRequest: (error) => res.status(error.status).send(error),
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
