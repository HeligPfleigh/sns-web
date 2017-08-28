import isArray from 'lodash/isArray';
import { alphaNumeric } from './Helper/Alpha';
import Message from './Helper/Message';

const validate = (value, locale = null) => {
  if (isArray(value)) {
    return value.every(val => validate(val, locale));
  }

  // Match at least one locale.
  if (!locale) {
    return Object.keys(alphaNumeric).some(loc => alphaNumeric[loc].test(value));
  }

  return (alphaNumeric[locale] || alphaNumeric.en).test(value);
};

export default (attribute, message = 'The ${ attribute } may only contain letters and numbers.', locale = null) => value => validate(value, locale) ? undefined : Message(message, { attribute });
