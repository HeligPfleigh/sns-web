import isString from 'lodash/isString';
import Message from './Helper/Message';
import Hexadecimal from './Hexadecimal';

const validate = str => isString(str) && Hexadecimal.validate(str) && str.length === 24;
export default (attribute, message = 'The ${ attribute } must be an MongoId.') => value => (validate(value) ? undefined : Message(message, { attribute }));
