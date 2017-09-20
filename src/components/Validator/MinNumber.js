import isNumber from 'lodash/isNumber';
import Message from './Helper/Message';

const validate = (value, min) => {
  try {
    value = parseFloat(value, 10);
    min = parseFloat(min, 10);
  } catch (e) {
    return false;
  }
  return isNumber(value) && isNumber(min) && (value >= min);
};

const MinNum = (attribute, message = 'The ${ attribute } may not be at least ${ min }.', min) => value => (validate(value, min) ? undefined : Message(message, { attribute, min }));
MinNum.validate = validate;

export default MinNum;
