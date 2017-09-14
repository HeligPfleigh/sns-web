import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Checkbox,
  HelpBlock,
 } from 'react-bootstrap';

export default class ReduxFormCheckboxField extends Component {
  render() {
    const { input, meta: { touched, error, warn }, ...props } = this.props;
    return (<div>
      <Checkbox {...input} {...props} />
      {touched && (error || warn) && <HelpBlock>{error || warn}</HelpBlock>}
    </div>);
  }
}

ReduxFormCheckboxField.propTypes = {
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
};
