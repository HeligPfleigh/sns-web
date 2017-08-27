import isArray from 'lodash/isArray';
import { alpha } from './Helper/Alpha';
import Message from './Helper/Message';

const validate = (value, locale = null) => {
  if (isArray(value)) {
    return value.every(val => validate(val, locale));
  }

  // Match at least one locale.
  if (!locale) {
    return Object.keys(alpha).some(loc => alpha[loc].test(value));
  }

  return (alpha[locale] || alpha.en).test(value);
};

export default (attribute, message = 'The :attribute may only contain letters.', locale = null) => value => validate(value, locale) ? undefined : Message(message, { attribute });
