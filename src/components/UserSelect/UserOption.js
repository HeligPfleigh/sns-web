import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Clearfix } from 'react-bootstrap';

class UserOption extends Component {

  handleMouseDown = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.props.onSelect(this.props.option, event);
  }

  handleMouseEnter = (event) => {
    this.props.onFocus(this.props.option, event);
  }

  handleMouseMove = (event) => {
    if (this.props.isFocused) return;
    this.props.onFocus(this.props.option, event);
  }

  render() {
    return (
      <div
        className={this.props.className}
        onMouseDown={this.handleMouseDown}
        onMouseEnter={this.handleMouseEnter}
        onMouseMove={this.handleMouseMove}
        title={this.props.option.title}
      >
        <div style={{ width: '32px', float: 'left' }}>
          <img
            alt={this.props.children}
            style={{ with: '32px', height: '32px', borderRadius: '50%' }}
            src={this.props.option.profile && this.props.option.profile.picture}
          />
        </div>
        <div style={{ marginLeft: '45px', lineHeight: '32px' }}>
          <strong>{this.props.children}</strong>
        </div>
        <Clearfix />
      </div>
    );
  }
}

UserOption.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  isFocused: PropTypes.bool,
  onFocus: PropTypes.func,
  onSelect: PropTypes.func,
  option: PropTypes.object.isRequired,
};

export default UserOption;
