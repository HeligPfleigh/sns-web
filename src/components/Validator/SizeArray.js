import isArray from 'lodash/isArray';
import Message from './Helper/Message';

export default (attribute, message = 'The ${ attribute } must contain ${ length } items.', length) => value => (isArray(value) && (value.length === length)) ? undefined : Message(message, { length, attribute });
