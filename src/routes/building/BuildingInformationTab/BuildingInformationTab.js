import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Panel } from 'react-bootstrap';
import s from './BuildingInformationTab.scss';

function getAddress({
  basisPoint,
  province,
  district,
  ward,
  street,
}) {
  return ` ${basisPoint}, ${street} - ${ward} - ${district} - ${province}`;
}

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
        <p className={s.textMuted}>{getAddress(building.address)}</p>
      </li>
    </ul>
  </Panel>
);

BuildingInformationTab.propTypes = {
  building: PropTypes.object,
};

export default withStyles(s)(BuildingInformationTab);
