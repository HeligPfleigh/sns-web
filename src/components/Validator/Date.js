import moment from 'moment';
import Message from './Helper/Message';

const withMoment = (value, ...options) => value instanceof moment ? value : moment(value, ...options);
const isValid = (value, ...options) => withMoment(value, ...options).isValid();
const isAfter = (value, date) => withMoment(value).isAfter(withMoment(date));
const isBefore = (value, date) => withMoment(value).isBefore(withMoment(date));
const isEqual = (value, date) => withMoment(value).isEqual(withMoment(date));

export default {
  withMoment,
  now: () => withMoment(),
  isValid: (attribute, message = 'The :attribute is not a valid date.', ...options) => value => isValid(value, ...options) ? undefined : Message(message, { attribute }),
  isAfter: (attribute, message = 'The :attribute must be a date after :date.', date) => value => isAfter(value, date) ? undefined : Message(message, { attribute, date }),
  isBefore: (attribute, message = 'The :attribute must be a date before :date.', date) => value => isBefore(value, date) ? undefined : Message(message, { attribute, date }),
  isEqual: (attribute, message = 'The :attribute must be a date equals to :date.', date) => value => isEqual(value, date) ? undefined : Message(message, { attribute, date }),
  isAfterOrEqual: (attribute, message = 'The :attribute must be a date after or equal to :date.', date) => value => isAfter(value, date) || isEqual(value, date) ? undefined : Message(message, { attribute, date }),
  isBeforeOrEqual: (attribute, message = 'The :attribute must be a date before or equal to :date.', date) => value => isBefore(value, date) || isEqual(value, date) ? undefined : Message(message, { attribute, date }),
};
