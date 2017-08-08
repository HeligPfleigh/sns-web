import React from 'react';
import PropTypes from 'prop-types';

const InputField = ({
  input,
  label,
  type,
  placeholder,
  meta: { touched, error, warning },
}) => (
  <div className="form-group">
    {label && <label htmlFor={input.name} className="col-sm-3 control-label">{label}</label>}
    <div className={`${label ? 'col-sm-9' : 'col-sm-12'}`}>
      <input
        id={input.name}
        name={input.name}
        type={type || 'text'}
        {...input}
        placeholder={placeholder}
        className="form-control"
        style={{ marginBottom: '5px' }}
      />
      {
        touched &&
        ((error && <span className="text-danger control-label">{error}</span>) ||
        (warning && <span className="text-warning control-label">{warning}</span>))
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
