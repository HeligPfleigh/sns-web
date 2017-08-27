import isString from 'lodash/isString';
import Message from './Helper/Message';

const uuid = {
  3: /^[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
  4: /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
  5: /^[0-9A-F]{8}-[0-9A-F]{4}-5[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
  all: /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
};

const validate = (value, version = 'all') => {
  const pattern = uuid[version];
  return isString(value) && pattern && pattern.test(value);
};

export default (attribute, message = 'The ${ attribute } must be a UUID.', version = 'all') => value => validate(value, version) ? undefined : Message(message, { attribute });
