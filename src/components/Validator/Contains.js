import isString from 'lodash/isString';
import Message from './Helper/Message';

const validate = (value, str) => isString(value) && value.indexOf(String(str)) > -1;

export default (attribute, message = 'The :attribute may only contain :str.', str) => value => validate(value, str) ? undefined : Message(message, { attribute, str });
