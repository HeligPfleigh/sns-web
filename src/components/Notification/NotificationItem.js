import React, { PropTypes } from 'react';
import { Image } from 'react-bootstrap';
// import { convertFromRaw } from 'draft-js';
// import { stateToHTML } from 'draft-js-export-html';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import _ from 'lodash';

import { NOTIFY_TYPES } from '../../constants';
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
  [NOTIFY_TYPES[1]]: lastContent => ` vừa bình luận bài viết ${lastContent}.`,
  [NOTIFY_TYPES[2]]: () => ' vừ:cập nhật trạng thái.',
};

const getNotifyContent = (currentUser, author, type, actors) => {
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
  static propTypes = {
    data: PropTypes.shape({
      _id: PropTypes.string,
      message: PropTypes.string,
      user: PropTypes.object,
    }),
    userInfo: PropTypes.object.isRequired,
    updateIsRead: PropTypes.func.isRequired,
    hidePopup: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      isFocus: false,
    };
  }

  onClick = (e) => {
    e.preventDefault();
    const {
      data: {
        _id,
        subject: {
          _id: subjectId,
        },
      },
      updateIsRead,
      hidePopup,
    } = this.props;

    updateIsRead(_id);
    if (hidePopup) {
      hidePopup();
    }
    history.push(`/post/${subjectId}`);
  }

  render() {
    const {
      data: {
        subject: {
          message,
          user: author,
        },
        isRead,
        type,
        actors,
        createdAt,
      },
      userInfo,
    } = this.props;

    const readStyle = isRead ? '' : s.readStyle;
    const fisrtContent = getActorsContent(actors);
    const lastContent = getNotifyContent(userInfo, author, type, actors, message);

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

export default withStyles(s)(NotificationItem);
