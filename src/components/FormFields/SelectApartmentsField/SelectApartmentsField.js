import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

const doNothing = () => {};

const SelectApartmentsField = ({
  input,
  multi,
  valueKey,
  labelKey,
  dataSource,
  placeholder,
  onInputChange,
  meta: { touched, error, warning },
}) => (
  <div className="displayFormRight">
    <Select
      {...input}
      multi={multi}
      valueKey={valueKey}
      labelKey={labelKey}
      options={dataSource}
      placeholder={placeholder}
      onBlur={() => {
        input.onBlur(input.value);
      }}
      onChange={(value) => {
        input.onChange(value);
      }}
      onInputChange={onInputChange || doNothing}
    />
    {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
  </div>
);

SelectApartmentsField.propTypes = {
  input: PropTypes.object.isRequired,
  multi: PropTypes.bool,
  valueKey: PropTypes.string,
  labelKey: PropTypes.string,
  dataSource: PropTypes.any.isRequired,
  placeholder: PropTypes.string,
  meta: PropTypes.object,
  onInputChange: PropTypes.func,
};

export default SelectApartmentsField;
