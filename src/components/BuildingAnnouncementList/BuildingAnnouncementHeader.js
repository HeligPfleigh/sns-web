import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './BuildingAnnouncementHeader.scss';

const BuildingAnnouncementHeader = () => (
  <li className={s.root}></li>
);

export default withStyles(s)(BuildingAnnouncementHeader);
