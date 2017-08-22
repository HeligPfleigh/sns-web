import React, { Component } from 'react';
import PropTypes from 'prop-types';

class CustomToggle extends Component {
  static propTypes = {
    onClick: PropTypes.func,
    children: PropTypes.any,
    styles: PropTypes.any,
  }

  constructor(props, context) {
    super(props, context);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    this.props.onClick(e);
  }

  render() {
    return (
      <span className={this.props.styles} onClick={this.handleClick}>
        {this.props.children}
      </span>
    );
  }
}

export default CustomToggle;
