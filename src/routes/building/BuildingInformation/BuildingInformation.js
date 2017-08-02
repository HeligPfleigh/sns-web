import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Panel } from 'react-bootstrap';
import s from './BuildingInformation.scss';

export const BuildingInformation = ({ building }) => (
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
        <p className={s.textMuted}>{building.address.street} {building.address.state} {building.address.city} {building.address.country} </p>
      </li>
    </ul>
  </Panel>
);

BuildingInformation.propTypes = {
  building: PropTypes.obj,
};

export default withStyles(s)(BuildingInformation);
