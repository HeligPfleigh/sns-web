import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Button, ButtonToolbar } from 'react-bootstrap';
import { PENDING, NONE, ACCEPTED, REJECTED } from '../../constants';
import s from './FriendStyle.scss';

class Friend extends React.Component {
  handleClickFriend = () => {
    const { friend, handleFriendAction, friendType } = this.props;
    if (friendType === ACCEPTED) {
      handleFriendAction(friend);
    }
  }
  render() {
    const { friend, handleFriendAction, friendType } = this.props;
    return (
      <li key={friend._id}>
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
              {
                friendType !== ACCEPTED &&
                <span>10 other mutual friends</span>
              }
            </div>
            {
              friendType === PENDING &&
              <ButtonToolbar>
                <Button title="Đồng ý kết bạn" onClick={() => handleFriendAction(friend._id, ACCEPTED)} bsStyle="primary">Đồng ý</Button>
                <Button title="Hủy kết bạn" onClick={() => handleFriendAction(friend._id, REJECTED)} >Hủy kết bạn</Button>
              </ButtonToolbar>
            }
            {
              friendType === NONE &&
              <ButtonToolbar className={s.addFriend}>
                <Button title="Thêm bạn mới" onClick={() => handleFriendAction(friend._id, PENDING)} bsStyle="primary" bsSize="xsmall">
                  <i className="fa fa-user-plus" />
                  Thêm bạn
                </Button>
              </ButtonToolbar>
            }
          </div>
        </div>
      </li>
    );
  }
}

Friend.propTypes = {
  friend: PropTypes.object.isRequired,
  handleFriendAction: PropTypes.func,
  friendType: PropTypes.string.isRequired,
};

export default withStyles(s)(Friend);
