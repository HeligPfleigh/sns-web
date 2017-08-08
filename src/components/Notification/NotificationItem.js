import React, { PropTypes } from 'react';
import { Image } from 'react-bootstrap';
// import { convertFromRaw } from 'draft-js';
// import { stateToHTML } from 'draft-js-export-html';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import _ from 'lodash';

import {
  LIKES,
  COMMENTS,
  NEW_POST,
  ACCEPTED_FRIEND,
  FRIEND_REQUEST,
  EVENT_INVITE,
  JOIN_EVENT,
  CAN_JOIN_EVENT,
  CANT_JOIN_EVENT,
} from '../../constants';
import TimeAgoWraper from '../TimeAgo';
import s from './NotificationItem.scss';
import history from '../../core/history';

const getActorsContent = (actors) => {
  if (actors && actors.length > 0) {
    const names = actors.map(actor => `${actor.profile.firstName} ${actor.profile.lastName}`);
    return names.join();
  }
  return '';
};

const collectionNotifyMessages = {
  [COMMENTS]: lastContent => ` vừa bình luận bài viết ${lastContent}.`,
  [NEW_POST]: () => ' vừa viết lên tường nhà bạn.',
  [ACCEPTED_FRIEND]: () => ' đã chấp nhận lời mời kết bạn của bạn',
  [FRIEND_REQUEST]: () => ' đã gửi cho bạn 1 lời mời kết bạn',
  [EVENT_INVITE]: () => ' vừa mời bạn tham gia 1 sự kiện',
  [JOIN_EVENT]: () => ' xác nhận tham gia sự kiện của bạn',
  [CAN_JOIN_EVENT]: () => ' có thể tham gia sự kiện của bạn',
  [CANT_JOIN_EVENT]: () => ' không thể tham gia sự kiện của bạn',
};

export const getNotifyContent = (currentUser, author, type, actors) => {
  if (actors && actors.length > 0) {
    const {
      _id: userId,
      // profile: {
      //   firstName,
      //   lastName,
      // },
    } = author;
    const { _id: currentUserId } = currentUser;

    let lastContent = 'của bạn';
    if (!_.isEqual(userId, currentUserId)) {
      lastContent = 'bạn đang theo dõi';
      // if (firstName && lastName) {
      //   lastContent = `của ${firstName} ${lastName}`;
      // }
    }

    let notifyContent = ` vừa thích bài viết ${lastContent}.`;
    if (type && collectionNotifyMessages[type]) {
      notifyContent = collectionNotifyMessages[type](lastContent);
    }

    return notifyContent;
  }

  return '';
};

class NotificationItem extends React.Component {

  onClick = (e) => {
    e.preventDefault();
    const {
      data: {
        _id,
        subject,
        isRead,
        type,
        actors,
      },
      updateIsRead,
      hidePopup,
    } = this.props;

    // check and call func update notification
    if (!isRead && updateIsRead) updateIsRead(_id);

    // Change state dropdown open=false;
    if (hidePopup) hidePopup();

    if (ACCEPTED_FRIEND === type) {
      history.push(`/user/${actors[0]._id}`);
    }

    if (FRIEND_REQUEST === type) {
      history.push('/friends');
    }

    // redirect to PostDetail Page
    if (subject) {
      if ([EVENT_INVITE, CAN_JOIN_EVENT, CANT_JOIN_EVENT].indexOf(type) > -1) {
        history.push(`/events/${subject._id}`);
      } else {
        history.push(`/post/${subject._id}`);
      }
    }
  }

  render() {
    const {
      data: {
        // subject: {
        //   user: author,
        // },
        user,
        isRead,
        type,
        actors,
        createdAt,
      },
      userInfo,
    } = this.props;
    const readStyle = isRead ? '' : s.readStyle;
    const fisrtContent = getActorsContent(actors);
    const lastContent = getNotifyContent(userInfo, user, type, actors);

    return (
      <div className={`${s.boxNotificationItem} ${readStyle}`}>
        <a href="#" onClick={this.onClick}>
          <div>
            <span className={s.avarta}>
              { actors && actors.length > 0 &&
                <Image src={actors[0].profile.picture} circle />
              }
            </span>
            <span>
              { actors && actors.length > 0 &&
                <p><strong>{fisrtContent}</strong> {lastContent}</p>
              }
              <TimeAgoWraper time={createdAt} />
            </span>
          </div>
        </a>
      </div>
    );
  }
}

NotificationItem.defaultProps = {
  data: {
    _id: '',
    message: '',
    user: {},
  },
  userInfo: {},
};

NotificationItem.propTypes = {
  data: PropTypes.shape({
    _id: PropTypes.string,
    message: PropTypes.string,
    user: PropTypes.object,
  }),
  userInfo: PropTypes.object.isRequired,
  updateIsRead: PropTypes.func.isRequired,
  hidePopup: PropTypes.func,
};

export default withStyles(s)(NotificationItem);
