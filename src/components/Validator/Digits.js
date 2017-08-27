import isArray from 'lodash/isArray';
import isNull from 'lodash/isNull';
import isUndefined from 'lodash/isUndefined';
import Message from './Helper/Message';

const validate = (value, length) => {
  if (isNull(length) || isUndefined(length)) {
    return false;
  }

  if (isArray(value)) {
    return value.every(val => validate(val, length));
  }
  const strVal = String(value);
  return /^[0-9]*$/.test(strVal) && strVal.length === Number(length);
};

export default (attribute, message = 'The :attribute must be :digits digits.', digits) => value => validate(value, digits) ? undefined : Message(message, { attribute, digits });
