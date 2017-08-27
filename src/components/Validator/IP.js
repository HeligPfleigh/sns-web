import isArray from 'lodash/isArray';
import isIP from './Helper/IP';
import Message from './Helper/Message';

const validate = (value, version = 4) => {
  if (isArray(value)) {
    return value.every(val => validate(val, version));
  }

  return isIP(value, version);
};

export default (attribute, message = 'The ${ attribute } must be a valid IP address.') => value => validate(value) ? undefined : Message(message, { attribute });
