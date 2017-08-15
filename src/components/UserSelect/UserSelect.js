import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import UserOption from './UserOption';
import UserValue from './UserValue';
import s from './UserSelect.scss';

const doNothing = () => {};

const UserSelect = ({
  style = {},
  name,
  value,
  options = [],
  onChange = doNothing,
  multi = false,
  clearable,
  disabled = false,
  labelKey = 'label',
  valueKey = 'value',
  placeholder = 'Tên một người bạn',
  clearValueText = 'Xóa mục đã chọn',
  loadingPlaceholder = 'Đang tải dữ liệu',
  noResultsText = 'Tòa nhà bạn chọn chưa có thông tin về căn hộ...',
}) => (
  <Select
    style={style}
    name={name}
    multi={multi}
    options={options}
    value={value}
    valueKey={valueKey}
    labelKey={labelKey}
    onChange={onChange}
    optionComponent={UserOption}
    valueComponent={UserValue}
    disabled={disabled}
    clearable={clearable}
    placeholder={placeholder}
    clearValueText={clearValueText}
    loadingPlaceholder={loadingPlaceholder}
    noResultsText={noResultsText}
  />
);

UserSelect.propTypes = {
  style: PropTypes.object,
  name: PropTypes.string.isRequired,
  value: PropTypes.any,
  options: PropTypes.array,
  onChange: PropTypes.func,
  multi: PropTypes.bool,
  clearable: PropTypes.bool,
  disabled: PropTypes.bool,
  labelKey: PropTypes.string,
  valueKey: PropTypes.string,
  placeholder: PropTypes.string,
  noResultsText: PropTypes.string,
  loadingPlaceholder: PropTypes.string,
  clearValueText: PropTypes.string,
};
export default withStyles(s)(UserSelect);
