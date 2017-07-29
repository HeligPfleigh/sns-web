import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './BuildingAnnouncementList.scss';

export const BuildingAnnouncementList = ({ children }) => (
  <div className={s.buildingNotificationList}>
    <ul>{children}</ul>
    <div className={s.buildingNotificationListFooter}>
      Xem thêm
    </div>
  </div>
);

BuildingAnnouncementList.propTypes = {
  children: PropTypes.node,
};

export default withStyles(s)(BuildingAnnouncementList);
