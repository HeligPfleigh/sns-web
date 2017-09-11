import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { generate as idRandom } from 'shortid';
import { Panel, Table } from 'react-bootstrap';
import { graphql, compose } from 'react-apollo';
import s from './BuildingInformationTab.scss';
import getBOMList from './getBOMList.graphql';


function getAddress({
  basisPoint,
  province,
  district,
  ward,
  street,
}) {
  return ` ${basisPoint}, ${street} - ${ward} - ${district} - ${province}`;
}

class BuildingInformationTab extends React.Component {
  render() {
    const { building, BOMList } = this.props;
    return (
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
          <li>
            <strong>Ban Quản Lý</strong>
            <table>
              <thead>
              </thead>
              <tbody>
                {
                  BOMList && BOMList.map((BOM) => {
                    const gender = BOM.profile.gender === 'male' ? 'Ông' : 'Bà';
                    return (
                      <tr key={idRandom()} className={s.textMuted}>
                        <td style={{ minWidth: 50 }}><span>{`${gender}:   `}</span></td>
                        <td style={{ minWidth: 250 }}><span className={s.textName}>{`${BOM.profile.fullName}`}</span></td>
                        <td><a href={`http://sns.mttjsc.com/user/${BOM._id}`}>Profile Link</a></td>
                      </tr>
                    );
                  })
                }
              </tbody>
            </table>
          </li>
        </ul>
      </Panel>
    );
  }
}

BuildingInformationTab.propTypes = {
  building: PropTypes.object,
  BOMList: PropTypes.array,
};

export default compose(
  withStyles(s),
  graphql(getBOMList, {
    options: props => ({
      variables: {
        buildingId: props.building._id,
      },
    }),
    props: ({ data }) => ({ BOMList: data.getBOMList }),
  }),
)(BuildingInformationTab);
