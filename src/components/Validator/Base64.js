import isString from 'lodash/isString';
import Message from './Helper/Message';

const validate = (str) => {
  if (!isString(str)) {
    return false;
  }

  const len = str.length;
  if (!len || len % 4 !== 0 || /[^A-Z0-9+/=]/i.test(str)) {
    return false;
  }

  const firstPaddingChar = str.indexOf('=');
  return firstPaddingChar === -1 ||
    firstPaddingChar === len - 1 ||
    (firstPaddingChar === len - 2 && str[len - 1] === '=');
};

export default (attribute, message = 'The ${ attribute } must be base64 encoding string.') => value => validate(value) ? undefined : Message(message, { attribute });
