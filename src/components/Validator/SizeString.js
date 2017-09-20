import isNumber from 'lodash/isNumber';
import Message from './Helper/Message';

const validate = (value, length) => {
  try {
    length = parseInt(length, 10);
    value = String(value);
  } catch (e) {
    return false;
  }
  return isNumber(length) && (value.length === length);
};


export default (attribute, message = 'The ${ attribute } must be ${ length } characters.', length) => value => (validate(value, length) ? undefined : Message(message, { length, attribute }));
