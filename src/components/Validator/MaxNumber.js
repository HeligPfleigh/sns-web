import isNumber from 'lodash/isNumber';
import Message from './Helper/Message';

export const isMax = (value, max) => {
  try {
    value = parseFloat(value, 10);
    max = parseFloat(max, 10);
  } catch (e) {
    return false;
  }

  return isNumber(value) && isNumber(max) && (value <= max);
};

export default (attribute, message = 'The ${ attribute } may not be greater than ${ max }.', max) => value => isMax(value, max) ? undefined : Message(message, { attribute, max });
