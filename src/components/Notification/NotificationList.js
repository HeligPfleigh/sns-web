import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import NotificationItem from './NotificationItem';
import s from './NotificationList.scss';

class NotificationList extends React.Component {
  static propTypes = {
    notifications: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
      }),
    ).isRequired,
    userInfo: PropTypes.object.isRequired,
    isHeader: PropTypes.bool,
    updateIsRead: PropTypes.func.isRequired,
    hidePopup: PropTypes.func,
  };

  render() {
    const { notifications, userInfo, isHeader, updateIsRead, hidePopup } = this.props;
    const header = isHeader || false;
    return (
      <span>
        { notifications && notifications.map(item => (
          item.user && item.subject && <NotificationItem
            key={`notification-${header ? 'header' : 'page'}-${item._id}`}
            data={item}
            userInfo={userInfo}
            updateIsRead={updateIsRead}
            hidePopup={hidePopup}
          />
        ))}
      </span>
    );
  }
}

export default withStyles(s)(NotificationList);
