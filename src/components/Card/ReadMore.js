import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Truncate from 'react-truncate';

class ReadMore extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      expanded: false,
      truncated: false,
    };

    this.handleTruncate = this.handleTruncate.bind(this);
    this.toggleLines = this.toggleLines.bind(this);
  }

  handleTruncate(truncated) {
    if (this.state.truncated !== truncated) {
      this.setState({
        truncated,
      });
    }
  }

  toggleLines(event) {
    event.preventDefault();

    this.setState({
      expanded: !this.state.expanded,
    });
  }

  render() {
    const {
      children,
      more,
      less,
      lines,
    } = this.props;

    const {
      expanded,
      truncated,
    } = this.state;

    return (
      <div>
        <Truncate
          lines={!expanded && lines}
          ellipsis={(
            <span>... <a href="#" onClick={this.toggleLines}><strong>{more}</strong></a></span>
          )}
          onTruncate={this.handleTruncate}
        >
          {children}
        </Truncate>
        {!truncated && expanded && (
          <span> <a href="#" onClick={this.toggleLines}><strong>{less}</strong></a></span>
        )}
      </div>
    );
  }
}

ReadMore.defaultProps = {
  lines: 5,
  more: 'Xem thêm',
  less: 'Rút gọn',
};

ReadMore.propTypes = {
  children: PropTypes.node,
  more: PropTypes.node,
  less: PropTypes.node,
  lines: PropTypes.number,
};

export default ReadMore;
