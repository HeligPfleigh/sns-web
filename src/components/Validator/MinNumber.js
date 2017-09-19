import isNumber from 'lodash/isNumber';
import Message from './Helper/Message';

export const isMin = (value, min) => {
  try {
    value = parseFloat(value, 10);
    min = parseFloat(min, 10);
  } catch (e) {
    return false;
  }

  return isNumber(value) && isNumber(min) && (value >= min);
};
export default (attribute, message = 'The ${ attribute } may not be at least ${ min }.', min) => value => isMin(value, min) ? undefined : Message(message, { attribute, min });
