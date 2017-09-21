import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FormControl,
  HelpBlock,
  InputGroup,
 } from 'react-bootstrap';

export default class ReduxFormInputField extends Component {
  formControl = (addon, input, props) => {
    if (addon) {
      return (<InputGroup><FormControl {...input} {...props} /><InputGroup.Addon>{addon}</InputGroup.Addon></InputGroup>);
    }
    return <FormControl {...input} {...props} />;
  }

  render() {
    const { input, meta: { touched, error, warn }, addon, ...props } = this.props;
    return (<div>
      {this.formControl(addon, input, props)}
      {touched && (error || warn) && <HelpBlock>{error || warn}</HelpBlock>}
    </div>);
  }
}

ReduxFormInputField.propTypes = {
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  addon: PropTypes.node,
};
