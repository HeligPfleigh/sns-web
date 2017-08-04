import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Panel } from 'react-bootstrap';
import s from './BuildingInformationTab.scss';

export const BuildingInformationTab = ({ building }) => (
  <Panel>
    <h3 className={s.informationBuildingHeader}>Thông Tin Chung Cư</h3>
    <div className={s.hrLine}></div>
    <ul className={s.informationBuilding}>
      <li>
        <strong>Tên Chung Cư</strong>
        <br />
        <p className={s.textMuted}>{ building.name }</p>
      </li>
      <li>
        <strong>Địa Chỉ Chung Cư</strong>
        <p className={s.textMuted}>{building.address.street} {building.address.country} </p>
      </li>
    </ul>
  </Panel>
);

BuildingInformationTab.propTypes = {
  building: PropTypes.object,
};

export default withStyles(s)(BuildingInformationTab);
