import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Button, ButtonToolbar } from 'react-bootstrap';
import s from './FriendItem.scss';

class FriendItem extends React.Component {

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
            <img alt={friend.profile && friend.profile.firstName} src={friend.profile && friend.profile.picture} />
          </div>
          <div className={s.friendInfo}>
            <div className={s.friendName}>
              <span>{friend.profile.firstName} {friend.profile.lastName}</span>
            </div>
            <ButtonToolbar className={s.addFriend}>
              <Button onClick={this.onCLick} bsStyle="primary" bsSize="xsmall">
                <i className="fa fa-user-plus" />
                Add Friend
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
