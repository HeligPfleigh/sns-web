import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormControl } from 'react-bootstrap';

export default class InputField extends Component {
  render() {
    const { input, meta, ...props } = this.props;
    return <FormControl {...input} {...props} />;
  }
}

InputField.propTypes = {
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
};
