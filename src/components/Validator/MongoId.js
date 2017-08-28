import isString from 'lodash/isString';
import Message from './Helper/Message';
import { isHexadecimal } from './Hexadecimal';

const validate = str => isString(str) && isHexadecimal(str) && str.length === 24;
export default (attribute, message = 'The ${ attribute } must be an MongoId.') => value => validate(value) ? undefined : Message(message, { attribute });
