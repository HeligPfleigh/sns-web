import isNumber from 'lodash/isNumber';
import Message from './Helper/Message';

const validate = (value, max) => {
  try {
    value = parseFloat(value, 10);
    max = parseFloat(max, 10);
  } catch (e) {
    return false;
  }

  return isNumber(value) && isNumber(max) && (value <= max);
};

const MaxNum = (attribute, message = 'The ${ attribute } may not be greater than ${ max }.', max) => value => (validate(value, max) ? undefined : Message(message, { attribute, max }));
MaxNum.validate = validate;

export default MaxNum;
