import isArray from 'lodash/isArray';
import isEmail from './Helper/Email';
import Message from './Helper/Message';

const validate = (value) => {
  if (isArray(value)) {
    return value.every(val => validate(val));
  }

  return isEmail(String(value));
};

export default (attribute, message = 'The :attribute must be a valid email address.', length) => value => validate(value, length) ? undefined : Message(message, { attribute });
