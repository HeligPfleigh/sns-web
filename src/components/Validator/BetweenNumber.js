import Message from './Helper/Message';
import MaxNumber from './MaxNumber';
import MinNumber from './MinNumber';

export default (attribute, message = 'The ${ attribute } must be between ${ min } and ${ max }.', min, max) => value => (MaxNumber.validate(value, max) && MinNumber.validate(value, min) ? undefined : Message(message, { attribute, min, max }));
