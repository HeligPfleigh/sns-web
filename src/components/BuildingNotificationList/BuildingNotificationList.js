import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './BuildingNotificationList.scss';

export const BuildingNotificationList = ({ className, children }) => (
  <div className={`${s.buildingNotificationList} ${className}`}>
    <ul>
      {children}
    </ul>
    <div className={s.buildingNotificationListFooter}>
      Xem thêm
    </div>
  </div>
);

BuildingNotificationList.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export default withStyles(s)(BuildingNotificationList);
