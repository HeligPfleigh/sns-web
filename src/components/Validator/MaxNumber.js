import isNumber from 'lodash/isNumber';
import Message from './Helper/Message';

export const isMax = (value, max) => isNumber(value) && isNumber(max) && (value <= max);
export default (attribute, message = 'The :attribute may not be greater than :max.', max) => value => isMax(value, max) ? undefined : Message(message, { attribute, max });
