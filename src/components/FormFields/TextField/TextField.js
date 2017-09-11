import React from 'react';
import PropTypes from 'prop-types';
import { FormControl } from 'react-bootstrap';

const TextField = ({
  input,
  type,
  placeholder,
  meta: { touched, error, warning },
}) => (
  <div className="displayFormRight">
    <FormControl
      {...input}
      placeholder={placeholder}
      type={type}
      onChange={(value) => {
        input.onChange(value);
      }}
    />
    {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
  </div>
);

TextField.propTypes = {
  placeholder: PropTypes.string,
  input: PropTypes.any,
  type: PropTypes.string,
  meta: PropTypes.object,
};

export default TextField;
