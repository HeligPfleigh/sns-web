import isNumber from 'lodash/isNumber';
import Message from './Helper/Message';

export default (attribute, message = 'The :attribute must be :length.', length) => value => (isNumber(value) && (String(value).length === length)) ? undefined : Message(message, { length, attribute });
