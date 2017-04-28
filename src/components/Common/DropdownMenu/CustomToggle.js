import React from 'react';

class CustomToggle extends React.Component {
  static propTypes = {
    onClick: React.PropTypes.func,
    children: React.PropTypes.any,
    styles: React.PropTypes.any,
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
