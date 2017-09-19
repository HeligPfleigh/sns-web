import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image, Clearfix } from 'react-bootstrap';
// import { convertFromRaw } from 'draft-js';
// import { stateToHTML } from 'draft-js-export-html';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import _ from 'lodash';

import {
  COMMENTS,
  NEW_POST,
  ACCEPTED_FRIEND,
  FRIEND_REQUEST,
  EVENT_INVITE,
  JOIN_EVENT,
  CAN_JOIN_EVENT,
  CANT_JOIN_EVENT,
  EVENT_DELETED,
  EVENT_CANCELLED,
  ACCEPTED_JOIN_BUILDING,
  REJECTED_JOIN_BUILDING,
  SHARING_POST,
  INTEREST_EVENT,
  DISINTEREST_EVENT,
  NEW_FEE_APARTMENT,
  NEW_ANNOUNCEMENT,
  REMIND_FEE,
} from '../../constants';
import TimeAgoWraper from '../TimeAgo';
import s from './NotificationItem.scss';
import history from '../../core/history';

const getActorsContent = (currentUser, author, type, actors) => {
  if (actors && actors.length > 0) {
    const {
      _id: userId,
    } = author;
    const { _id: currentUserId } = currentUser;

    if (([ACCEPTED_JOIN_BUILDING, REJECTED_JOIN_BUILDING].indexOf(type) > -1) && (currentUserId === userId) && (actors[0]._id === userId)) {
      return '';
    }
    return actors.map(actor => `${actor.profile.firstName} ${actor.profile.lastName}`).join();
  }
  return '';
};

const collectionNotifyMessages = {
  [SHARING_POST]: lastContent => ` chia sẻ bài viết ${lastContent}.`,
  [COMMENTS]: lastContent => ` vừa bình luận bài viết ${lastContent}.`,
  [NEW_POST]: () => ' vừa viết lên tường nhà bạn.',
  [ACCEPTED_FRIEND]: () => ' đã chấp nhận lời mời kết bạn của bạn',
  [FRIEND_REQUEST]: () => ' đã gửi cho bạn 1 lời mời kết bạn',
  [EVENT_INVITE]: () => ' vừa mời bạn tham gia 1 sự kiện',
  [JOIN_EVENT]: () => ' xác nhận tham gia sự kiện của bạn',
  [CAN_JOIN_EVENT]: () => ' có thể tham gia sự kiện của bạn',
  [CANT_JOIN_EVENT]: () => ' không thể tham gia sự kiện của bạn',
  [EVENT_DELETED]: () => ' đã xóa sự kiện',
  [EVENT_CANCELLED]: () => ' đã hủy sự kiện',
  [ACCEPTED_JOIN_BUILDING]: itsme => (itsme ? 'Bạn đã được chấp nhận tham gia vào tòa nhà' : ' được chấp nhận tham gia vào tòa nhà'),
  [REJECTED_JOIN_BUILDING]: itsme => (itsme ? 'Bạn đã bị từ chối tham gia vào tòa nhà' : ' bị từ chối tham gia vào tòa nhà'),
  [INTEREST_EVENT]: () => ' vừa quan tâm sự kiện bạn tạo',
  [DISINTEREST_EVENT]: () => ' vừa hủy quan tâm sự kiện của bạn',
  [NEW_FEE_APARTMENT]: () => '',
  [NEW_ANNOUNCEMENT]: () => '',
  [REMIND_FEE]: () => '',
};

export const getNotifyContent = (currentUser, author, type, actors, data) => {
  if (type === NEW_FEE_APARTMENT || type === REMIND_FEE) {
    return data.text;
  } else if (actors && actors.length > 0) {
    const {
      _id: userId,
    } = author;
    const { _id: currentUserId } = currentUser;

    let lastContent = 'của bạn';
    if (!_.isEqual(userId, currentUserId)) {
      lastContent = 'bạn đang theo dõi';
    }

    let notifyContent = ` vừa thích bài viết ${lastContent}.`;
    if (type && collectionNotifyMessages[type]) {
      notifyContent = collectionNotifyMessages[type]([ACCEPTED_JOIN_BUILDING, REJECTED_JOIN_BUILDING].indexOf(type) > -1 ? (currentUserId === userId) && (actors[0]._id === userId) : lastContent);
    }

    return notifyContent;
  } else if (type === NEW_ANNOUNCEMENT) {
    return 'Bạn vừa nhận được thông báo mới từ tòa nhà';
  }

  return '';
};

class NotificationItem extends Component {

  onClick = (e) => {
    e.preventDefault();
    const {
      data: {
        _id,
        subject,
        isRead,
        type,
        actors,
        data,
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

    if (EVENT_DELETED === type) {
      history.push('/events');
    }

    if (NEW_FEE_APARTMENT === type) {
      history.push(`/apartment/${data.apartment}/service_fee`);
    }

    if (REMIND_FEE === type) {
      history.push(`/apartment/${data.apartment}/service_fee`);
    }

    if (NEW_ANNOUNCEMENT === type) {
      history.push(`/announcement/${data.announcement}`);
    }

    if ([ACCEPTED_JOIN_BUILDING, REJECTED_JOIN_BUILDING].indexOf(type) > -1) {
      // history.push('/building');
    }

    // redirect to PostDetail Page
    if (subject) {
      if ([EVENT_INVITE, CAN_JOIN_EVENT, CANT_JOIN_EVENT, EVENT_CANCELLED].indexOf(type) > -1) {
        history.push(`/events/${subject._id}`);
      } else {
        history.push(`/post/${subject._id}`);
      }
    }
  }

  render() {
    const {
      data: {
        user,
        isRead,
        type,
        actors,
        createdAt,
        data,
      },
      userInfo,
    } = this.props;
    const readStyle = isRead ? '' : s.readStyle;
    const fisrtContent = getActorsContent(userInfo, user, type, actors);
    const lastContent = getNotifyContent(userInfo, user, type, actors, data);

    return (
      <div className={`${s.boxNotificationItem} ${readStyle}`}>
        <a href="#" onClick={this.onClick}>
          <div>
            <span className={s.avarta}>
              { actors && actors.length > 0 ?
                <Image src={actors[0].profile.picture} circle /> :
                <Image src="/bg.jpg" circle />
              }
            </span>
            <span>
              { actors && actors.length > 0 ?
                <p><strong>{fisrtContent}</strong> {lastContent}</p> : <p> {lastContent}</p>
              }
              <TimeAgoWraper time={createdAt} />
            </span>
          </div>
        </a>
        <Clearfix />
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
