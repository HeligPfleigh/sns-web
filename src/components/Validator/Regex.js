import Message from './Helper/Message';

const validate = (value, regex, ...flags) => {
  if (regex instanceof RegExp) {
    return regex.test(value);
  }
  return new RegExp(regex, flags).test(String(value));
};

export default (attribute, message = 'The ${ attribute } format is invalid.', regex, ...flags) => value => validate(value, regex, ...flags) ? undefined : Message(message, { attribute });
