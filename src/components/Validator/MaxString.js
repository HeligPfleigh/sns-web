import isString from 'lodash/isString';
import isNumber from 'lodash/isNumber';
import Message from './Helper/Message';

export const isMax = (value, max) => {
  try {
    max = parseInt(max, 10);
  } catch (e) {
    return false;
  }

  return isString(value) && isNumber(max) && (String(value).trim().length <= max);
};

export default (attribute, message = 'The ${ attribute } may not be greater than ${ max } characters.', max) => value => isMax(value, max) ? undefined : Message(message, { attribute, max });
