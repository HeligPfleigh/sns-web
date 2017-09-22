import Message from './Helper/Message';
import MaxArray from './MaxArray';
import MinArray from './MinArray';

export default (attribute, message = 'The ${ attribute } must have between ${ min } and ${ max } items.', min, max) => value => (MaxArray.validate(value, max) && MinArray.validate(value, min) ? undefined : Message(message, { attribute, min, max }));
