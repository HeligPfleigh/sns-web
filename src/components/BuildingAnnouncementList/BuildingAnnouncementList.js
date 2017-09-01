import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Link from '../Link';
import s from './BuildingAnnouncementList.scss';

const BuildingAnnouncementList = ({ children, buildingId }) => {
  return (
    <div className={s.buildingAnnouncementList}>
      <ul>{children}</ul>
      <div className={s.buildingAnnouncementListFooter}>
        <Link to={`/building/${buildingId}/announcements`} style={{ textDecoration: 'none', color: '#337ab7' }}>
          Xem thêm
        </Link>
      </div>
    </div>
  );
};

BuildingAnnouncementList.propTypes = {
  children: PropTypes.node,
  buildingId: PropTypes.string,
};

export default withStyles(s)(BuildingAnnouncementList);
