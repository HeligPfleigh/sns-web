import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './FriendsList.scss';

export const FriendsList = ({ className, children }) => (
  <div className={`${s.friendList} ${className}`}>
    <ul>
      {children}
    </ul>
  </div>
);

FriendsList.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export default withStyles(s)(FriendsList);
