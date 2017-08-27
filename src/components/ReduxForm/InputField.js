import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FormControl,
  HelpBlock,
 } from 'react-bootstrap';

export default class ReduxFormInputField extends Component {
  render() {
    const { input, meta: { touched, error, warn }, ...props } = this.props;
    return (<div>
      <FormControl {...input} {...props} />
      {touched && (error || warn) && <HelpBlock>{error || warn}</HelpBlock>}
    </div>);
  }
}

ReduxFormInputField.propTypes = {
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
};
