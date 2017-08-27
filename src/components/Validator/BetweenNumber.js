import Message from './Helper/Message';
import { isMax } from './MaxNumber';
import { isMin } from './MinNumber';

export default (attribute, message = 'The :attribute must be between :min and :max.', min, max) => value => (isMax(value, max) && isMin(value, min)) ? undefined : Message(message, { attribute, min, max });
