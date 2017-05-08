import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { MenuItem } from 'react-bootstrap';
import NotificationItem from './NotificationItem';
import history from '../../core/history';
import s from './NotificationList.scss';

class NotificationList extends React.Component {
  static propTypes = {
    notifications: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
      }),
    ).isRequired,
    userInfo: PropTypes.object.isRequired,
  };

  navEventHandler = (path) => {
    history.push(path);
  };

  render() {
    const { notifications, userInfo } = this.props;
    return (
      <span>
        { notifications && notifications.map(item => (
          item.user && item.subject && <MenuItem
            key={`notification-${item._id}`}
            href={`/posts/${item.subject._id}`}
          >
            <NotificationItem data={item} userInfo={userInfo} />
          </MenuItem>
        ))}
      </span>
    );
  }
}

export default withStyles(s)(NotificationList);
