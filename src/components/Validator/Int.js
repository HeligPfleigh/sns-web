import isArray from 'lodash/isArray';
import Message from './Helper/Message';

const validate = (value) => {
  if (isArray(value)) {
    return value.every(val => validate(val));
  }

  return /^-?[0-9]+$/.test(String(value));
};

const Int = (attribute, message = 'The ${ attribute } must be an integer.') => value => (validate(value) ? undefined : Message(message, { attribute }));
Int.validate = validate;

export default Int;

