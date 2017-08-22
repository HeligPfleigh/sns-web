import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { generate as idRandom } from 'shortid';
import NotificationItem from './NotificationItem';
import s from './NotificationList.scss';

class NotificationList extends Component {
  static propTypes = {
    notifications: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
      }),
    ).isRequired,
    userInfo: PropTypes.object.isRequired,
    updateIsRead: PropTypes.func.isRequired,
    hidePopup: PropTypes.func,
  };

  render() {
    const { notifications, userInfo, updateIsRead, hidePopup } = this.props;
    return (
      <span>
        { notifications && notifications.map(item => (
          item.user && <NotificationItem
            key={idRandom()}
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
