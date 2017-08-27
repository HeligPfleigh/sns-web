import Message from './Helper/Message';

export default (attribute, message = 'The :attribute and :other must match.', other) => value => (value === other) ? undefined : Message(message, { attribute, other });
