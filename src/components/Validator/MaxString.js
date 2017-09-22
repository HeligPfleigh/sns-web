import isNumber from 'lodash/isNumber';
import Message from './Helper/Message';

const validate = (value, max) => {
  try {
    max = parseInt(max, 10);
    value = String(value);
  } catch (e) {
    return false;
  }

  return isNumber(max) && (value.length <= max);
};

const MaxString = (attribute, message = 'The ${ attribute } may not be greater than ${ max } characters.', max) => value => (validate(value, max) ? undefined : Message(message, { attribute, max }));
MaxString.validate = validate;

export default MaxString;
