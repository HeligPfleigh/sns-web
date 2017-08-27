import isArray from 'lodash/isArray';
import isNumber from 'lodash/isNumber';
import Message from './Helper/Message';

const validate = (value) => {
  if (isArray(value)) {
    return value.every(val => validate(val));
  }

  return isNumber(value);
};

export default (attribute, message = 'The :attribute must be a number.') => value => validate(value) ? undefined : Message(message, { attribute });
