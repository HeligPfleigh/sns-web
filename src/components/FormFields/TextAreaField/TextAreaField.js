import React from 'react';
import PropTypes from 'prop-types';
import { FormControl } from 'react-bootstrap';

const TextAreaField = ({
  input,
  componentClass,
  placeholder,
  meta: { touched, error, warning },
}) => (
  <div className="displayFormRight">
    <FormControl
      {...input}
      placeholder={placeholder}
      componentClass={componentClass}
      style={{ minHeight: '200px' }}
    />
    {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
  </div>
);

TextAreaField.propTypes = {
  placeholder: PropTypes.string,
  input: PropTypes.any,
  componentClass: PropTypes.string,
  meta: PropTypes.object,
};

export default TextAreaField;
