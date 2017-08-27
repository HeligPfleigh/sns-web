import isArray from 'lodash/isArray';
import Message from './Helper/Message';

const validate = (value, params) => {
  if (isArray(value)) {
    return value.every(val => validate(val, params));
  }

  if (value === null || value === undefined || value === '') {
    return true;
  }

  const decimals = isArray(params) ? (params[0] || '*') : '*';

  // if is 0.
  if (Number(decimals) === 0) {
    return /^-?\d*$/.test(value);
  }

  const regexPart = decimals === '*' ? '+' : `{1,${decimals}}`;
  const regex = new RegExp(`^-?\\d*(\\.\\d${regexPart})?$`);

  if (!regex.test(value)) {
    return false;
  }

  const parsedValue = parseFloat(value);

  // eslint-disable-next-line
  return parsedValue === parsedValue;
};

export default (attribute, message = 'The :attribute must be a decimal numeric.', params = ['*']) => value => validate(value, params) ? undefined : Message(message, { attribute });
