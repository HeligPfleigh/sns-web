import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Button, ButtonToolbar } from 'react-bootstrap';
import Link from '../Link';
import s from './FriendItem.scss';

class FriendItem extends Component {

  onCLick = (evt) => {
    evt.preventDefault();
    const { friend, handleFriendAction } = this.props;
    handleFriendAction(friend._id);
  }

  render() {
    const { friend } = this.props;
    return (
      <li>
        <div className={s.friend} onClick={this.handleClickFriend}>
          <div className={s.friendAvatar}>
            <Link to={`/user/${friend._id}`}>
              <img
                alt={friend.profile && friend.profile.firstName}
                src={friend.profile && friend.profile.picture}
                title={friend.profile && `${friend.profile.firstName} ${friend.profile.lastName}`}
              />
            </Link>
          </div>
          <div className={s.friendInfo}>
            <div className={s.friendName}>
              <Link to={`/user/${friend._id}`}>
                <span>{friend.profile.firstName} {friend.profile.lastName}</span>
              </Link>
            </div>
            <ButtonToolbar className={s.addFriend}>
              <Button title="Thêm bạn mới" onClick={this.onCLick} bsStyle="primary" bsSize="xsmall">
                <i className="fa fa-user-plus" />Thêm bạn
              </Button>
            </ButtonToolbar>
          </div>
        </div>
      </li>
    );
  }
}

FriendItem.propTypes = {
  friend: PropTypes.object.isRequired,
  handleFriendAction: PropTypes.func,
};

export default withStyles(s)(FriendItem);
