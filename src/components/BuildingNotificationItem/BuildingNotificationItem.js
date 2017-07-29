import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './BuildingNotificationItem.scss';

class BuildingNotificationItem extends Component {
  render() {
    const { notification } = this.props;
    return (
      <li>
        <div className={s.buildingNotificationItem}>
          <div className={s.buildingNotificationIcon}>
            <i className="fa fa-bullhorn fa-2x" style={{ backgroundColor: `${notification.type === 'type01' ? '#006400' : '#FF8C00'}` }} aria-hidden="true"></i>
          </div>
          <div className={s.buildingNotificationInfo}>
            <strong>{notification.title}</strong>
            <br />
            <small>{notification.date}</small>
          </div>
        </div>
      </li>
    );
  }
}

BuildingNotificationItem.propTypes = {
  notification: PropTypes.object.isRequired,
};

export default withStyles(s)(BuildingNotificationItem);
