import isArray from 'lodash/isArray';
import isNumber from 'lodash/isNumber';
import Message from './Helper/Message';

const validate = (value, max) => {
  try {
    max = parseInt(max, 10);
  } catch (e) {
    return false;
  }

  return isArray(value) && isNumber(max) && (value.length <= max);
};

const MaxArray = (attribute, message = 'The ${ attribute } may not have more than ${ max } items.', max) => value => (validate(value, max) ? undefined : Message(message, { attribute, max }));
MaxArray.validate = validate;

export default MaxArray;
