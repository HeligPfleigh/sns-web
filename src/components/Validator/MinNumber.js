import isNumber from 'lodash/isNumber';
import Message from './Helper/Message';

export const isMin = (value, min) => isNumber(value) && isNumber(min) && (value >= min);
export default (attribute, message = 'The ${ attribute } may not be at least ${ min }.', min) => value => isMin(value, min) ? undefined : Message(message, { attribute, min });
