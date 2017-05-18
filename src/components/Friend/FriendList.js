import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Friend from './Friend';
import Label from './Label';
import s from './FriendStyle.scss';
import { PENDING } from '../../constants';

class FriendList extends React.Component {
  static propTypes = {
    className: PropTypes.string
  }
  render() {
    const { className, children } = this.props;
    return (
      <div className={`${s.friendList} ${className}`}>
          {children}
      </div>
    );
  }
}

export default withStyles(s)(FriendList);
