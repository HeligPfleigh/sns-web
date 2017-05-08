import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { MenuItem } from 'react-bootstrap';
import s from './Notification.scss';
import Notification from './Notification';
import history from '../../core/history';

// {`${item.actors[0].profile.lastName} vua thuc hien ${item.type} bai viet ${item.subject._id}`}
class NotificationList extends React.Component {
  static propTypes = {
    notifications: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
      }),
    ).isRequired,
    userInfo: PropTypes.object.isRequired,
    // likePostEvent: PropTypes.func.isRequired,
    // unlikePostEvent: PropTypes.func.isRequired,
  };

  navEventHandler = (path) => {
    history.push(path);
  };

  // href={`/${item.user.username}/posts/${item._id}`}
  render() {
    const { notifications, userInfo } = this.props;
    return (
      <span>
        { notifications && notifications.map(item => (
          item.user && item.subject && <MenuItem
            key={`notification-${item._id}`}
            href={`/${item.user.username}/posts/${item.subject._id}`}
          >
            <Notification data={item} userInfo={userInfo} />
          </MenuItem>
        ))}
      </span>
    );
  }
}

export default withStyles(s)(NotificationList);
