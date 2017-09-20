import isArray from 'lodash/isArray';
import isNumber from 'lodash/isNumber';
import Message from './Helper/Message';

const validate = (value, min) => {
  try {
    min = parseInt(min, 10);
  } catch (e) {
    return false;
  }

  return isArray(value) && isNumber(min) && (value.length >= min);
};

const MinArray = (attribute, message = 'The ${ attribute } may not have at least ${ min } items.', min) => value => (validate(value, min) ? undefined : Message(message, { attribute, min }));
MinArray.validate = validate;

export default MinArray;
