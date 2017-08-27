import isArray from 'lodash/isArray';
import isUrl from './Helper/Url';
import Message from './Helper/Message';

const validate = (value, requireProtocol = true, allowUnderscores = true) => {
  const options = { require_protocol: !!requireProtocol, allow_underscores: !!allowUnderscores };
  if (isArray(value)) {
    return value.every(val => validate(val, options));
  }
  return isUrl(value, options);
};

export default (attribute, message = 'The :attribute format is invalid.', ...options) => value => validate(value, ...options) ? undefined : Message(message, { attribute });
