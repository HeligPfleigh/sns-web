import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import moment from 'moment';
import {
  TYPE1,
} from '../../../constants';
import s from './BuildingAnnouncementItem.scss';

export const BuildingAnnouncementItem = ({ data }) => (
  <li>
    <div className={s.buildingAnnouncementItem}>
      <div className={s.buildingAnnouncementIcon}>
        <i className="fa fa-bullhorn fa-2x" style={{ backgroundColor: `${data.type === TYPE1 ? '#006400' : '#FF8C00'}` }} aria-hidden="true"></i>
      </div>
      <div className={s.buildingAnnouncementInfo}>
        <strong>{data.message}</strong>
        <br />
        <small>{moment(data.date).format('HH:mm DD/MM/YYYY')}</small>
      </div>
    </div>
  </li>
);

BuildingAnnouncementItem.propTypes = {
  data: PropTypes.object,
};

export default withStyles(s)(BuildingAnnouncementItem);
