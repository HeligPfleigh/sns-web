import isArray from 'lodash/isArray';
import Message from './Helper/Message';

const validate = (value, list) => {
  if (isArray(value)) {
    return value.every(val => validate(val, list));
  }

  return list.filter(option => option === value).length === 0;
};

export default (attribute, message = 'The selected :attribute is invalid.', list) => value => (isArray(list) && validate(value, list)) ? undefined : Message(message, { attribute });
