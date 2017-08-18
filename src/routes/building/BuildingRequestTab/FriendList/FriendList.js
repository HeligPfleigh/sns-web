import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './FriendStyle.scss';

class FriendList extends Component {
  render() {
    const { className, children } = this.props;
    return (
      <div className={`${s.friendList} ${className}`}>
        <ul>
          {children}
        </ul>
      </div>
    );
  }
}

FriendList.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export default withStyles(s)(FriendList);
