import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Col, Image } from 'react-bootstrap';
import s from './BuildingItem.scss';
import history from '../../../../core/history';

class BuildingItem extends Component {

  onRedirect = () => {
    const { building: { _id } } = this.props;
    history.push(`/management/${_id}`);
  }

  render() {
    const { building } = this.props;
    let addressStr = '';
    if (building.address) {
      const { address } = building;
      addressStr = `${isEmpty(address.basisPoint) ? '' : (`${address.basisPoint}, `)}`;
      addressStr = `${addressStr} - ${isEmpty(address.street) ? '' : address.street}`;
      addressStr = `${addressStr} - ${isEmpty(address.ward) ? '' : address.ward}`;
      addressStr = `${addressStr} - ${isEmpty(address.district) ? '' : address.district}`;
      addressStr = `${addressStr} - ${isEmpty(address.province) ? '' : address.province}`;
      addressStr = `${addressStr} - ${isEmpty(address.country) ? '' : address.country}`;
    }

    return (
      <Col style={{ marginBottom: 10 }} md={6} >
        <div className={s.building} onClick={this.onRedirect}>
          <div className={s.photo}>
            <Image responsive alt={building.display} src={building.avarta || '/bg.jpg'} />
          </div>
          <div className={s.content}>
            <h5 className={s.title}>{building.display}</h5>
            <p>
              <strong>
                <i className="fa fa-map-marker" aria-hidden="true"></i>&nbsp;
                Địa chỉ:&nbsp;
              </strong>
              {addressStr}
            </p>
            <p>Hiện <strong>{building.totalApartment}</strong> căn hộ.</p>
          </div>
        </div>
      </Col>
    );
  }
}

BuildingItem.propTypes = {
  building: PropTypes.object.isRequired,
};

export default withStyles(s)(BuildingItem);

