import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import FriendOnlineItem from './FriendOnlineItem';
import s from './FriendOnlineList.scss';

const FriendOnlineList = ({ className, friends, online, directMessages }) => (
  <div className={`${s.friendList} ${className}`}>
    <ul>
      {
        friends.map(friend =>
          <FriendOnlineItem
            key={friend.chatId}
            friend={friend}
            isOnline={online[friend.chatId]}
            conversationId={directMessages[friend.chatId.toString()]}
          />)
      }
    </ul>
  </div>
);

FriendOnlineList.propTypes = {
  className: PropTypes.string,
  friends: PropTypes.array.isRequired,
  online: PropTypes.object,
  directMessages: PropTypes.object,
};

export default withStyles(s)(FriendOnlineList);
