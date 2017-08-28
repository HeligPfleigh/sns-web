import isString from 'lodash/isString';
import Message from './Helper/Message';

const validate = value => isString(value) && /^[\x00-\x7F]+$/.test(value);
export default (attribute, message = 'The ${ attribute } may only contain ASCII characters.') => value => validate(value) ? undefined : Message(message, { attribute });
