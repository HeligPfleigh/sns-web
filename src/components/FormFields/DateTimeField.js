import React from 'react';
import PropTypes from 'prop-types';
// import { OverlayTrigger, Tooltip } from 'react-bootstrap';
// import moment from 'moment';
import DateTime from 'react-datetime';

const currentDate = new Date();
const isValidValue = () => true;

const DateTimeField = ({
  input,
  label,
  placeholder,
  defaultValue,
  dateFormat,
  timeFormat,
  isValidDate,
  meta: {
    warning,
    touched,
    error,
  },
}) => (
  <div className={`form-group ${error ? 'has-error' : ''}`}>
    {label &&
      <label htmlFor={input.name} className="col-sm-3 control-label">
        {label}
      </label>
    }
    <div className="col-sm-5">
      <DateTime
        id={input.name}
        name={input.name}
        value={input.value}
        locale="vi"
        inputProps={{
          readOnly: true,
          placeholder: { placeholder },
        }}
        closeOnSelect
        dateFormat={dateFormat || false}
        timeFormat={timeFormat || false}
        closeOnTab
        input
        defaultValue={defaultValue || currentDate}
        isValidDate={isValidDate || isValidValue}
        onChange={(param) => {
          input.onChange(param);
        }}
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

DateTimeField.propTypes = {
  label: PropTypes.string,
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  placeholder: PropTypes.string,
  defaultValue: PropTypes.any,
  isValidDate: PropTypes.func,
  dateFormat: PropTypes.any,
  timeFormat: PropTypes.any,
};
export default DateTimeField;
