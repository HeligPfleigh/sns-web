import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import isEmpty from 'lodash/isEmpty';
// import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './SelectField.scss';

const SelectField = ({
  input,
  label,
  isAsync,
  multi,
  dataSource,
  disabled = false,
  labelKey = 'label',
  valueKey = 'value',
  noResultsText = 'Dữ liệu không tồn tại',
  placeholder = 'Chọn tòa nhà bạn đang ở!',
  loadingPlaceholder = 'Đang tải dữ liệu',
  clearValueText = 'Xóa mục đã chọn',
  meta: {
    warning,
    touched,
    error,
  },
}) => (
  <div className="form-group">
    {label &&
      <label htmlFor={input.name} className="col-sm-3 control-label">
        {label}
      </label>
    }
    <div className={`${label ? 'col-sm-9' : 'col-sm-12'}`}>
      { !isAsync && <Select
        disabled={disabled}
        multi={multi}
        {...input}
        labelKey={labelKey}
        valueKey={valueKey}
        clearable={!isEmpty(input.value)}
        noResultsText={noResultsText}
        placeholder={placeholder}
        clearValueText={clearValueText}
        options={dataSource}
        onBlur={() => {
          input.onBlur(input.value);
        }}
        onChange={(value) => {
          input.onChange(value);
        }}
        loadingPlaceholder={loadingPlaceholder}
      /> }

      { isAsync && <Select.Async
        disabled={disabled}
        isLoading
        multi={multi}
        {...input}
        labelKey={labelKey}
        valueKey={valueKey}
        clearable={!isEmpty(input.value)}
        noResultsText={noResultsText}
        placeholder={placeholder}
        clearValueText={clearValueText}
        loadOptions={dataSource}
        onBlur={() => {
          input.onBlur(input.value);
        }}
        onChange={(value) => {
          input.onChange(value);
        }}
        loadingPlaceholder={loadingPlaceholder}
      /> }

      { (touched || error || warning) && <div style={{ height: '5px' }} /> }
      {
        touched &&
        ((error && <span className="text-danger control-label">{error}</span>) ||
        (warning && <span className="text-warning control-label">{warning}</span>))
      }
    </div>
  </div>
);

SelectField.propTypes = {
  disabled: PropTypes.bool,
  multi: PropTypes.bool,
  isAsync: PropTypes.bool,
  label: PropTypes.string,
  labelKey: PropTypes.string,
  valueKey: PropTypes.string,
  placeholder: PropTypes.string,
  noResultsText: PropTypes.string,
  loadingPlaceholder: PropTypes.string,
  clearValueText: PropTypes.string,
  meta: PropTypes.object.isRequired,
  input: PropTypes.object.isRequired,
  dataSource: PropTypes.any.isRequired,
};
export default withStyles(s)(SelectField);
