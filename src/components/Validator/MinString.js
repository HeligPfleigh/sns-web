import isString from 'lodash/isArray';
import isNumber from 'lodash/isNumber';
import Message from './Helper/Message';

export const isMin = (value, min) => isString(value) && isNumber(min) && (String(value).trim().length >= min);
export default (attribute, message = 'The :attribute may not be at least :min characters.', min) => value => isMin(value, min) ? undefined : Message(message, { attribute, min });
