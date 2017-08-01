import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Image } from 'react-bootstrap';
import s from './FriendOnlineItem.scss';
import moment from 'moment';
import Link from '../Link';

moment.locale('vi');

class FriendOnlineItem extends React.Component {

  onCLick = (evt) => {
    evt.preventDefault();
    const { friend, handleFriendAction } = this.props;
    handleFriendAction(friend._id);
  }

  render() {
    const { friend, isOnline, conversationId } = this.props;
    let conversationIdToRedirect = conversationId;
    if (!conversationId) {
      conversationIdToRedirect = '';
    }
    let status;

    if (typeof (isOnline) === 'boolean') {
      status = <i className={`fa fa-circle ${s.iconOnline}`} aria-hidden="true"></i>;
    } else if (typeof (isOnline) === 'number') {
      status = moment(isOnline).fromNow();
    } else {
      status = null;
    }

    return (
      <Link
        title="T"
        to={`/messages/${conversationIdToRedirect}`}
      >
        <li>
          <div onClick={this.handleClickFriend} className={s.friendChatItem}>
            <div>
              <Image
                className={s.avatarCircle}
                alt={friend.profile && friend.profile.firstName}
                src={friend.profile && friend.profile.picture}
                title={friend.profile && `${friend.profile.firstName} ${friend.profile.lastName}`}
                circle
              />
            </div>
            <div className={s.nameContainer}>
              <div className={s.textName}>
                <span>{friend.profile.firstName} {friend.profile.lastName}</span>
              </div>
            </div>
            {status}
          </div>
        </li>
      </Link>
    );
  }
}

FriendOnlineItem.propTypes = {
  friend: PropTypes.object.isRequired,
  handleFriendAction: PropTypes.func,
  isOnline: PropTypes.any,
  conversationId: PropTypes.string,
};

export default withStyles(s)(FriendOnlineItem);
