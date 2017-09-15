import isArray from 'lodash/isArray';
import isNumber from 'lodash/isNumber';
import Message from './Helper/Message';

export const isMin = (value, min) => {
  try {
    min = parseInt(min, 10);
  } catch (e) {
    return false;
  }

  return isArray(value) && isNumber(min) && (value.length >= min);
};
export default (attribute, message = 'The ${ attribute } may not have at least ${ min } items.', min) => value => isMin(value, min) ? undefined : Message(message, { attribute, min });
