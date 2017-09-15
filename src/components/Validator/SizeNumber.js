import isNumber from 'lodash/isNumber';
import Message from './Helper/Message';

const validate = (value, length) => {
  try {
    value = parseFloat(value, 10);
    length = parseInt(length, 10);
  } catch (e) {
    return false;
  }

  return !isNaN(value) && (String(value).trim().length === length);
};

export default (attribute, message = 'The ${ attribute } must be ${ length }.', length) => value => validate(value, length) ? undefined : Message(message, { length, attribute });
