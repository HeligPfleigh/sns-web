import React from 'react';
import PropTypes from 'prop-types';

const InputField = ({
  input,
  label,
  type,
  placeholder,
  meta: { touched, error, warning },
}) => (
  <div className={`form-group ${error ? 'has-error' : ''}`}>
    {label && <label htmlFor={input.name} className="col-sm-3 control-label">{label}</label>}
    <div className="col-sm-9">
      <input
        id={input.name}
        name={input.name}
        type={type}
        {...input}
        placeholder={placeholder}
        className="form-control"
        style={{ marginBottom: '5px' }}
      />
      {
        touched &&
        ((error && <span className="control-label">{error}</span>) ||
        (warning && <span className="control-label">{warning}</span>))
      }
    </div>
  </div>
);

InputField.propTypes = {
  label: PropTypes.any,
  input: PropTypes.any,
  placeholder: PropTypes.any,
  type: PropTypes.any,
  meta: PropTypes.any,
};

export default InputField;
