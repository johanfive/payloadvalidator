const { type, createExpressValidator: createValidator } = require('.');

const personValidator = createValidator(type.shape({
  firstName: type.string.isRequired,
  lastName: type.string,
  arr: type.arrayOf(type.arrayOf(type.string.isRequired).isRequired).isRequired,
  nested: type.shape({
    reqStr: type.string.isRequired,
    optStr: type.string,
  }),
  oneOf3: type.oneOf([type.string, type.number, type.shape({ lol: type.string.isRequired })]),
}));


const send = (response) => console.log(JSON.stringify(response, null, 2));
const res = {
  status: (code) => {
    console.log(code);
    return { send };
  },
  send,  
};
const next = () => console.log('next is called');

const req = {
  body: {
    lastName: 5,
    arr: [[, 5]],
    nested: { lool: 55 },
    oneOf3: { lool: '5' }
  }
};

personValidator(req, res, next);
