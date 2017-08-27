import isString from 'lodash/isString';
import Message from './Helper/Message';

export const isHexadecimal = str => isString(str) && /^[0-9A-F]+$/i.test(str);
export default (attribute, message = 'The :attribute must be an hexadecimal.') => value => isHexadecimal(value) ? undefined : Message(message, { attribute });
