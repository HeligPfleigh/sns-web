import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Friend from './Friend';
import Label from './Label';
import s from './FriendStyle.scss';
import { PENDING } from '../../constants';

class FriendList extends React.Component {
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
  className: PropTypes.string
};

export default withStyles(s)(FriendList);
