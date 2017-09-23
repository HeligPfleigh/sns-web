import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  Row,
  Col,
  Clearfix,
  ControlLabel,
} from 'react-bootstrap';
import moment from 'moment';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './UserInfo.scss';

@withStyles(s)
class UserInfo extends Component {

  genderLabel = (gender) => {
    switch (gender) {
      case 'male':
        return 'Nam';
      case 'female':
        return 'Nữ';
      default:
        return 'Khác';
    }
  };

  render() {
    const { userInfo: { profile, phone, email: emailVal } } = this.props;

    const defaultVal = 'chưa có thông tin.';
    const initialValues = {
      firstName: (profile && profile.firstName) || defaultVal,
      lastName: (profile && profile.lastName) || defaultVal,
      gender: (profile && profile.gender) || undefined,
      email: (emailVal && emailVal.address) || defaultVal,
      phone: (phone && phone.number) || defaultVal,
      address: (profile && profile.address) || defaultVal,
      dob: (profile && profile.dob && moment(profile.dob).format('DD-MM-YYYY')) || defaultVal,
    };

    return (
      <div className={s.container}>
        <Grid className={s.profile}>
          <Row className={s.profileInfo}>
            <Col sm={3}>
              <i className="fa fa-user-circle-o fa-2x" aria-hidden="true"></i>
              <ControlLabel>Họ và Tên</ControlLabel>
            </Col>
            <Col sm={9} className={s.profileRight}>
              {`${initialValues.firstName} ${initialValues.lastName}`}
            </Col>
          </Row>
          <Row className={s.profileInfo}>
            <Col sm={3}>
              <i className="fa fa-venus-mars fa-2x" aria-hidden="true"></i>
              <ControlLabel>Giới Tính</ControlLabel>
            </Col>
            <Col sm={9} className={s.profileRight}>
              { this.genderLabel(initialValues.gender) }
            </Col>
          </Row>
          <Row className={s.profileInfo}>
            <Col sm={3}>
              <i className="fa fa-birthday-cake fa-2x" aria-hidden="true"></i>
              <ControlLabel>Ngày sinh</ControlLabel>
            </Col>
            <Col sm={9} className={s.profileRight}>
              { initialValues.dob }
            </Col>
          </Row>
          <Row className={s.profileInfo}>
            <Col sm={3}>
              <i className="fa fa-phone-square fa-2x" aria-hidden="true"></i>
              <ControlLabel>Số điện thoại</ControlLabel>
            </Col>
            <Col sm={9} className={s.profileRight}>
              { initialValues.phone }
            </Col>
          </Row>
          <Row className={s.profileInfo}>
            <Col sm={3}>
              <i className="fa fa-envelope fa-2x" aria-hidden="true"></i>
              <ControlLabel>Email</ControlLabel>
            </Col>
            <Col sm={9} className={s.profileRight}>
              { initialValues.email }
            </Col>
          </Row>
          <Row className={s.profileInfo}>
            <Col sm={3}>
              <i className="fa fa-location-arrow fa-2x" aria-hidden="true"></i>
              <ControlLabel>Địa chỉ</ControlLabel>
            </Col>
            <Col sm={9} className={s.profileRight}>
              { initialValues.address }
            </Col>
          </Row>
          <Clearfix />
        </Grid>
      </div>
    );
  }
}

UserInfo.propTypes = {
  userInfo: PropTypes.object.isRequired,
};

export default UserInfo;
