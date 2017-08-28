import isArray from 'lodash/isArray';
import { alphaDash } from './Helper/Alpha';
import Message from './Helper/Message';

const validate = (value, locale = null) => {
  if (isArray(value)) {
    return value.every(val => validate(val, locale));
  }

  // Match at least one locale.
  if (!locale) {
    return Object.keys(alphaDash).some(loc => alphaDash[loc].test(value));
  }

  return (alphaDash[locale] || alphaDash.en).test(value);
};

export default (attribute, message = 'The ${ attribute } may only contain letters, numbers, and dashes.', locale = null) => value => validate(value, locale) ? undefined : Message(message, { attribute });
