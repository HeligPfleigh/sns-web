import isString from 'lodash/isString';
import Message from './Helper/Message';

const validate = str => isString(str) && /^[0-9A-F]+$/i.test(str);
const Hexadecimal = (attribute, message = 'The ${ attribute } must be an hexadecimal.') => value => (validate(value) ? undefined : Message(message, { attribute }));
Hexadecimal.validate = validate;

export default Hexadecimal;
