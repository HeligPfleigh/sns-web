import { createElement } from 'react';
import _ from 'lodash';

const fieldToValue = ({ value, initialValue }) => typeof value !== 'undefined' ? value : initialValue;
const makeFieldsSafe = fields => _.mapValues(fields, field => typeof field.value !== 'undefined' ? field : { ...field, value: fieldToValue(field) });
const makeValuesSafe = (values, safeFields) => _.mapValues(values, (value, fieldName) => typeof value !== 'undefined' ? value : safeFields[fieldName].value);

/**
 * "Safely" wrap up a FormComponent before passing it to reduxForm
 *  This basically ensures that field.value and values[field] are reliably available...
 *  Pending redux-form patch. See {@link https://github.com/erikras/redux-form/pull/843}
 * @param {Component} component
 * @return {Component}
 */
export default function MakeFormSafe(component) {
  return ({ fields, values, ...otherProps }) => {
    const safeFields = makeFieldsSafe(fields);
    return createElement(component, {
      ...otherProps,
      fields: safeFields,
      values: makeValuesSafe(values, safeFields),
    });
  };
}
