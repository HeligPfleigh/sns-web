import isArray from 'lodash/isArray';
import { alphaSpaces } from './Helper/Alpha';
import Message from './Helper/Message';

const validate = (value, locale = null) => {
  if (isArray(value)) {
    return value.every(val => validate(val, locale));
  }

  // Match at least one locale.
  if (!locale) {
    return Object.keys(alphaSpaces).some(loc => alphaSpaces[loc].test(value));
  }

  return (alphaSpaces[locale] || alphaSpaces.en).test(value);
};

export default (attribute, message = 'The ${ attribute } may only contain letters and space.', locale = null) => value => validate(value, locale) ? undefined : Message(message, { attribute });
