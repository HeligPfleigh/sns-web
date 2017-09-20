import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FormControl,
  HelpBlock,
 } from 'react-bootstrap';

export default class ReduxFormMultiSelectField extends Component {
  render() {
    const { input, meta: { touched, error, warn }, componentClass, ...props } = this.props;
    return (<div>
      <FormControl componentClass="textarea" {...input} {...props} />
      {touched && (error || warn) && <HelpBlock>{error || warn}</HelpBlock>}
    </div>);
  }
}

ReduxFormMultiSelectField.propTypes = {
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  componentClass: PropTypes.string.isRequired,
};

ReduxFormMultiSelectField.defaultProps = {
  componentClass: 'textarea',
};
