import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDateTime from 'react-datetime';
import {
  HelpBlock,
 } from 'react-bootstrap';

export default class ReduxFormDateTimeField extends Component {
  constructor(...args) {
    super(...args);

    this.onChange = this.onChange.bind(this);
    this.componentRef = this.componentRef.bind(this);
  }

  onChange(dateSelected) {
    const { input, closeOnSelect } = this.props;
    input.onChange(dateSelected);

    // Fix bug: When the attribute named closeOnSelect has defined, the datetime picker popup always hidden.
    if (closeOnSelect) {
      // this.datetimeRef.closeCalendar();
    }
  }

  componentRef(datetimeRef) {
    this.datetimeRef = datetimeRef;
  }

  render() {
    const { input: { onChange, ...input }, meta: { touched, error, warn }, closeOnSelect, ...props } = this.props;
    return (<div>
      <ReactDateTime {...input} {...props} ref={this.componentRef} onChange={this.onChange} />
      {touched && (error || warn) && <HelpBlock>{error || warn}</HelpBlock>}
    </div>);
  }
}

ReduxFormDateTimeField.propTypes = {
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  closeOnSelect: PropTypes.bool,
};
