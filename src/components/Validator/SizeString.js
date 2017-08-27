import isString from 'lodash/isString';
import Message from './Helper/Message';

export default (attribute, message = 'The ${ attribute } must be ${ length } characters.', length) => value => (isString(value) && (String(value).trim().length === length)) ? undefined : Message(message, { length, attribute });
