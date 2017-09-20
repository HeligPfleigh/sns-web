import * as _ from 'lodash';
import Message from './Helper/Message';
import MaxString from './MaxString';
import MinString from './MinString';

export default (attribute, message = 'The ${ attribute } must be between ${ min } and ${ max } characters.', min, max) => value => (MaxString.validate(value, max) && MinString.validate(value, min) ? undefined : Message(message, { attribute, min, max }));
