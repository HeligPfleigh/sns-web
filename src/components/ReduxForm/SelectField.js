import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FormControl,
  HelpBlock,
 } from 'react-bootstrap';

export default class ReduxFormSelectField extends Component {
  render() {
    const { input, meta: { touched, error, warn }, options, componentClass, ...props } = this.props;
    let key = 0;
    return (<div>
      <FormControl componentClass="select" {...input} {...props}>
        {options.map(option => (<option key={key++} value={option.value}>{option.label}</option>))}
      </FormControl>
      {touched && (error || warn) && <HelpBlock>{error || warn}</HelpBlock>}
    </div>);
  }
}

ReduxFormSelectField.propTypes = {
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  componentClass: PropTypes.string.isRequired,
};

ReduxFormSelectField.defaultProps = {
  componentClass: 'select',
};

