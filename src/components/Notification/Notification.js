import React, { PropTypes } from 'react';
import { Image, Clearfix } from 'react-bootstrap';
import { convertFromRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import TimeAgo from 'react-timeago';
import vnStrings from 'react-timeago/lib/language-strings/vi';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import _ from 'lodash';

import { NOTIFY_TYPES } from '../../constants';
import s from './Notification.scss';

const formatter = buildFormatter(vnStrings);

const getActorsContent = (actors) => {
  if (actors && actors.length > 0) {
    const names = actors.map(actor => `${actor.profile.firstName} ${actor.profile.lastName}`);
    return names.join();
  }
  return '';
};

const getNotifyContent = (currentUser, author, type, actors, message) => {
  // {`${item.actors[0].profile.lastName} vua thuc hien ${item.type} bai viet ${item.subject._id}`}
  if (actors && actors.length > 0) {
    const { _id: userId } = author;
    const { _id: currentUserId } = currentUser;

    let lastContent = 'của bạn';
    if (!_.isEqual(userId, currentUserId)) {
      lastContent = 'của bạn';
    }

    let notifyContent;
    switch (type) {
      case NOTIFY_TYPES[1]:
        notifyContent = ` vừa thực hiện bình luận bài viết ${lastContent}.`;
        break;
      case NOTIFY_TYPES[2]:
        notifyContent = ' vừa thực hiện cập nhật trạng thái.';
        break;
      default:
        notifyContent = ` vừa thực hiện thích bài viết ${lastContent}.`;
        break;
    }

    return notifyContent;
  }

  return '';
};

class Notification extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      _id: PropTypes.string,
      message: PropTypes.string,
      user: PropTypes.object,
    }),
    userInfo: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isFocus: false,
    };
  }

  onClickCommentBtn = (e) => {
    e.preventDefault();
    this.setState({
      isFocus: !this.state.isFocus,

    });
    // const { data: { _id } } = this.props;
    // goToAnchor(`#add-comment-${_id}`);
  }

  render() {
    const {
      data: {
        subject: {
          message,
          user: author,
        },
        type,
        actors,
        createdAt,
      },
      userInfo,
    } = this.props;

    // console.log('Notification');
    // console.log(this.props);
    const fisrtContent = getActorsContent(actors);
    const lastContent = getNotifyContent(userInfo, author, type, actors, message);

    return (
      <span className={s.notificationPanel}>
        <span className={s.avarta}>
          { actors && actors.length > 0 &&
            <Image src={actors[0].profile.picture} circle />
          }
        </span>
        <span className={s.content}>
          { actors && actors.length > 0 &&
            <p><strong>{fisrtContent}</strong> {lastContent}</p>
          }
          <TimeAgo date={createdAt} formatter={formatter} />
        </span>
        <Clearfix />
      </span>
    );
  }
}

export default withStyles(s)(Notification);
