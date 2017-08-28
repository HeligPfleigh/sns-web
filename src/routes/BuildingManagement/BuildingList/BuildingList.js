import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import BuildingItem from './BuildingItem';
import s from './BuildingList.scss';

class BuildingList extends Component {

  render() {
    const { buildings } = this.props;

    return (
      <div className={s.buildings}>
        <h4>Danh sách chung cư đang quản lý</h4>
        <Row>
          <Col md={12}>
            { (buildings || []).map(building => <BuildingItem
              key={Math.random()}
              building={building}
            />) }
          </Col>
        </Row>
      </div>
    );
  }
}
BuildingList.propTypes = {
  buildings: PropTypes.array,
};

export default withStyles(s)(BuildingList);
