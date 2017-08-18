import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Button, ButtonToolbar } from 'react-bootstrap';
import s from './FriendItem.scss';

class FriendActionItem extends Component {

  onAcceptCLick = (evt) => {
    evt.preventDefault();
    const { friend, handleAcceptFriendAction } = this.props;
    handleAcceptFriendAction(friend._id);
  }

  onRejectCLick = (evt) => {
    evt.preventDefault();
    const { friend, handleRejectFriendAction } = this.props;
    handleRejectFriendAction(friend._id);
  }

  render() {
    const { friend } = this.props;
    return (
      <li>
        <div className={s.friend} onClick={this.handleClickFriend}>
          <div className={s.friendAvatar}>
            <img
              alt={friend.profile && friend.profile.firstName}
              src={friend.profile && friend.profile.picture}
              title={friend.profile && `${friend.profile.firstName} ${friend.profile.lastName}`}
            />
          </div>
          <div className={s.friendInfo}>
            <div className={s.friendName}>
              <span>{friend.profile.firstName} {friend.profile.lastName}</span>
            </div>
            <ButtonToolbar>
              <Button title="Đồng ý kết bạn" onClick={this.onAcceptCLick} bsStyle="primary">Đồng ý</Button>
              <Button title="Hủy kết bạn" onClick={this.onRejectCLick} >Hủy kết bạn</Button>
            </ButtonToolbar>
          </div>
        </div>
      </li>
    );
  }
}

FriendActionItem.propTypes = {
  friend: PropTypes.object.isRequired,
  handleAcceptFriendAction: PropTypes.func,
  handleRejectFriendAction: PropTypes.func,
};

export default withStyles(s)(FriendActionItem);
