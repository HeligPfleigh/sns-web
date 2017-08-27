import isString from 'lodash/isString';
import Message from './Helper/Message';

const validate = value => isString(value) && /^#?([0-9A-F]{3}|[0-9A-F]{6})$/i.test(value);
export default (attribute, message = 'The :attribute must be a hexal color code.') => value => validate(value) ? undefined : Message(message, { attribute });
