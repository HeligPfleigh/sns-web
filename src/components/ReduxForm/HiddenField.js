import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isFunction from 'lodash/isFunction';

export default class ReduxFormHiddenField extends Component {
  componentWillMount() {
    const { onFill, input } = this.props;
    if (isFunction(onFill)) {
      onFill(input.value);
    }
  }

  componentDidUpdate(prevProps) {
    const { onFill, input } = this.props;
    if (isFunction(onFill) && input.value !== prevProps.input.value) {
      onFill(input.value);
    }
  }

  render() {
    return null;
  }
}

ReduxFormHiddenField.propTypes = {
  input: PropTypes.object.isRequired,
  onFill: PropTypes.func,
};
