import Message from './Helper/Message';
import { isMax } from './MaxArray';
import { isMin } from './MinArray';

export default (attribute, message = 'The ${ attribute } must have between ${ min } and ${ max } items.', min, max) => value => (isMax(value, max) && isMin(value, min)) ? undefined : Message(message, { attribute, min, max });
