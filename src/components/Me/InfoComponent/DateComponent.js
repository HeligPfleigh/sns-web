import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';

class DateComponent extends Component {

  render() {
    const { input, placeholder, defaultValue, meta: { touched, error } } = this.props;

    return (
      <div>

        <DatePicker {...input} dateForm="MM/DD/YYYY" selected={input.value ? moment(input.value) : null} />
        {touched && error && <span>{error}</span>}
      </div>
    );
  }
}
export default DateComponent;
