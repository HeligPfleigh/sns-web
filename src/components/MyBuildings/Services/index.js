import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Row, Col, Image } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import history from '../../../core/history';
import s from './styles.scss';

class BuildingServices extends Component {

  doNothing = (evt) => {
    if (evt) evt.preventDefault();
  }

  goFeesPage = (evt, feeType) => {
    if (evt) evt.preventDefault();
    const { buildingId } = this.props;
    history.push(`/my-buildings/${buildingId}/services?feeType=${feeType}`);
  }

  render() {
    return (
      <span className={classNames(s.boxServices)}>
        <Row>
          <Col md={12}>
            <h2 className={classNames(s.titleTab)}>
              <span>Dịch vụ & Tiện ích tòa nhà</span>
            </h2>
          </Col>
        </Row>
        <Row className={classNames('row', s.boxItemService)}>
          <Col xs={12} sm={6} md={4}>
            <a href="#" className={classNames(s.itemService)} onClick={evt => this.goFeesPage(evt, 1)}>
              <Image src="/images/img_dien.png" />
              <div className={classNames(s.boxTextItemService)}>
                <h2><span>Điện sinh hoạt</span></h2>
              </div>
            </a>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <a href="#" className={classNames(s.itemService)} onClick={evt => this.goFeesPage(evt, 2)}>
              <Image src="/images/img_nuoc.png" />
              <div className={classNames(s.boxTextItemService)}>
                <h2><span>Nước sinh hoạt</span></h2>
              </div>
            </a>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <a href="#" className={classNames(s.itemService)} onClick={evt => this.goFeesPage(evt, 4)}>
              <Image src="/images/img_guixe.png" />
              <div className={classNames(s.boxTextItemService)}>
                <h2><span>Dịch vụ gửi xe</span></h2>
              </div>
            </a>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <a href="#" className={classNames(s.itemService)} onClick={evt => this.goFeesPage(evt, 3)}>
              <Image src="/images/img_phidichvu.png" />
              <div className={classNames(s.boxTextItemService)}>
                <h2><span>Phí dịch vụ</span></h2>
              </div>
            </a>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <a href="#" className={classNames(s.itemService)} onClick={this.doNothing}>
              <Image src="/images/img_giupviec.png" />
              <div className={classNames(s.boxTextItemService)}>
                <h2><span>Sửa chữa & Giúp việc</span></h2>
              </div>
            </a>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <a href="#" className={classNames(s.itemService)} onClick={this.doNothing}>
              <Image src="/images/img_bacsi.png" />
              <div className={classNames(s.boxTextItemService)}>
                <h2><span>Bác sĩ tại nhà</span></h2>
              </div>
            </a>
          </Col>
        </Row>
      </span>
    );
  }
}

BuildingServices.propTypes = {
  buildingId: PropTypes.string.isRequired,
};

export default withStyles(s)(BuildingServices);
