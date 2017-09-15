import isArray from 'lodash/isArray';
import Message from './Helper/Message';

const validate = (value) => {
  if (isArray(value)) {
    return value.every(val => validate(val));
  }

  try {
    value = parseFloat(value, 10);
  } catch (e) {
    return false;
  }

  return !isNaN(value);
};

export default (attribute, message = 'The ${ attribute } must be a number.') => value => validate(value) ? undefined : Message(message, { attribute });
