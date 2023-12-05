const { type, createValidator } = require('./src').express;

const personValidator = createValidator(type.shape({
  firstName: type.string.isRequired,
  lastName: type.string,
  devices: type.arrayOf(type.shape({
    label: type.string.isRequired,
    value: type.string.isRequired,
    notificationPriority: type.number
  }).isRequired).isRequired,
  skills: type.shape({
    usefull: type.string.isRequired,
    absurd: type.string,
    canCook: type.boolean.isRequired
  }),
  weakApi: type.oneOf([type.string, type.number, type.shape({ lol: type.string.isRequired })])
}));


const send = (response) => console.log(JSON.stringify(response, null, 2));
const res = {
  status: (code) => {
    console.log(code);
    return { send };
  },
  send
};
const next = () => console.log('next is called');

const validDevice = { label: 'Personal Email', value: 'you@contact.me', notificationPriority: 1 };
const req = {
  body: {
    lastName: 5,
    // eslint-disable-next-line no-sparse-arrays
    devices: [, validDevice, { ...validDevice, notificationPriority: '8' }],
    skills: { usefull: 'programming' },
    weakApi: { almost: '5' }
  }
};

personValidator(req, res, next);
