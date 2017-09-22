import isNumber from 'lodash/isNumber';
import Message from './Helper/Message';

const validate = (value, min) => {
  try {
    min = parseInt(min, 10);
    value = String(value);
  } catch (e) {
    return false;
  }
  return isNumber(min) && (value.length >= min);
};

const MinString = (attribute, message = 'The ${ attribute } may not be at least ${ min } characters.', min) => value => (validate(value, min) ? undefined : Message(message, { attribute, min }));
MinString.validate = validate;

export default MinString;
