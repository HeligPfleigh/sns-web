import isArray from 'lodash/isArray';
import isNumber from 'lodash/isNumber';
import Message from './Helper/Message';

export const isMax = (value, max) => isArray(value) && isNumber(max) && (value.length <= max);
export default (attribute, message = 'The :attribute may not have more than :max items.', max) => value => isMax(value, max) ? undefined : Message(message, { attribute, max });
