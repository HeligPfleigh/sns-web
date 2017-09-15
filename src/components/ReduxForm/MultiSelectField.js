import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FormControl,
  HelpBlock,
 } from 'react-bootstrap';

export default class ReduxFormMultiSelectField extends Component {
  render() {
    const { input, meta: { touched, error, warn }, options, multiple, ...props } = this.props;
    let key = 0;
    return (<div>
      <FormControl componentClass="select" multiple {...input} {...props}>
        {options.map(option => (<option key={key++} value={option.value}>{option.label}</option>))}
      </FormControl>
      {touched && (error || warn) && <HelpBlock>{error || warn}</HelpBlock>}
    </div>);
  }
}

ReduxFormMultiSelectField.propTypes = {
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  componentClass: PropTypes.string.isRequired,
  multiple: PropTypes.bool.isRequired,
};

ReduxFormMultiSelectField.defaultProps = {
  componentClass: 'select',
  multiple: true,
};
