import isArray from 'lodash/isArray';
import Message from './Helper/Message';

const validate = (value, params = [false]) => {
  if (isArray(value)) {
    return value.length > 0;
  }

  // incase a field considers `false` as an empty value like checkboxes.
  const invalidateFalse = params[0];
  if (value === false && invalidateFalse) {
    return false;
  }

  if (value === undefined || value === null) {
    return false;
  }

  return String(value).trim().length > 0;
};

const Required = (attribute, message = 'The ${ attribute } is required.', params = [false]) => value => (validate(value, params) ? undefined : Message(message, { attribute }));
Required.validate = validate;
Required.Unless = (attribute, message = 'The ${ attribute } is required.', other) => (value, currentValues) => (validate(currentValues[other]) ? undefined : (validate(value) ? undefined : Message(message, { attribute })));

export default Required;

