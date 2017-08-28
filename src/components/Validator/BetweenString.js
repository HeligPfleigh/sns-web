import * as _ from 'lodash';
import Message from './Helper/Message';
import { isMax } from './MaxString';
import { isMin } from './MinString';

export default (attribute, message = 'The ${ attribute } must be between ${ min } and ${ max } characters.', min, max) => value => (isMax(value, max) && isMin(value, min)) ? undefined : Message(message, { attribute, min, max });
