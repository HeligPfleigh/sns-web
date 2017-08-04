import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import { Grid, Row, Col, ControlLabel, Clearfix } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import userApprovalPageQuery from './userApprovalPageQuery.graphql';
import s from './UserApprovalPage.scss';

class UserApprovalPage extends Component {

  backBuildingRequestTab = () => history.back()

  acceptUser = (evt) => {
    evt.preventDefault();
    const { data: { resident } } = this.props;
    alert(resident._id);
  }

  rejectUser = (evt) => {
    evt.preventDefault();
    const { data: { resident } } = this.props;
    alert(resident._id);
  }

  render() {
    const { data: { resident } } = this.props;
    return (
      <div>
        {resident &&
          <Grid>
            <Row>
              <Col md={8} sm={12} xs={12} className={s.profile}>
                <Row className={s.backBuildingRequestTab}>
                  <Col md={8} sm={12} xs={12}>
                    <div onClick={this.backBuildingRequestTab}>
                      <i className="fa fa-chevron-left" aria-hidden="true"></i>
                      <h4>Quay lại trang</h4>
                    </div>
                    <h3>THÔNG TIN</h3>
                  </Col>
                </Row>
                <Row className={s.profileInfo}>
                  <Col sm={3}>
                    <i className="fa fa-user-circle" aria-hidden="true"></i>
                    <ControlLabel htmlFor="name">Name</ControlLabel>
                  </Col>
                  <Col sm={9} className={s.profileRight}>
                    {resident.profile.lastName} {resident.profile.firstName}
                  </Col>
                </Row>
                <Row className={s.profileInfo}>
                  <Col sm={3}>
                    <i className="fa fa-mobile" aria-hidden="true"></i>
                    <ControlLabel htmlFor="phoneNumber">Số điện thoại</ControlLabel>
                  </Col>
                  <Col sm={9} className={s.profileRight}>
                    094 559 36 37
                  </Col>
                </Row>
                <Row className={s.profileInfo}>
                  <Col sm={3}>
                    <i className="fa fa-building" aria-hidden="true"></i>
                    <ControlLabel htmlFor="address">Địa chỉ</ControlLabel>
                  </Col>
                  <Col sm={9} className={s.profileRight}>
                    Căn hộ A204, Tòa tháp Tây Hacorplaza
                  </Col>
                </Row>
                <Row className={s.profileInfo}>
                  <Col sm={3}>
                    <i className="fa fa-envelope-o" aria-hidden="true"></i>
                    <ControlLabel htmlFor="email">Email</ControlLabel>
                  </Col>
                  <Col sm={9} className={s.profileRight}>
                    abc@gmail.com
                  </Col>
                </Row>
                <Row className={s.profileInfo}>
                  <Col sm={3}>
                    <i className="fa fa-venus-mars" aria-hidden="true"></i>
                    <ControlLabel htmlFor="gender">Giới Tính</ControlLabel>
                  </Col>
                  <Col sm={9} className={s.profileRight}>
                    {resident.profile.gender === 'male' ? 'Nam' : 'Nữ'}
                  </Col>
                </Row>
                <Row className={s.profileInfo}>
                  <Col sm={3}>
                    <i className="fa fa-birthday-cake" aria-hidden="true"></i>
                    <ControlLabel htmlFor="email">Ngày sinh</ControlLabel>
                  </Col>
                  <Col sm={9} className={s.profileRight}>
                    16 tháng 5 năm 1980
                  </Col>
                </Row>
                <Row>
                  <Col md={8} sm={12} xs={12}>
                    <button
                      onClick={this.acceptUser}
                      className={s.buttonAccept}
                    >
                      Đồng ý
                    </button>
                    <button
                      onClick={this.rejectUser}
                      className={s.buttonCancel}
                    >
                      Từ chối
                    </button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Grid>
        }
      </div>
    );
  }
}

UserApprovalPage.propTypes = {
  data: PropTypes.shape({
    resident: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
      profile: PropTypes.shape({
        picture: PropTypes.string.isRequired,
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        gender: PropTypes.string.isRequired,
      }),
    }),
  }).isRequired,
};

export default compose(
  withStyles(s),
  graphql(userApprovalPageQuery, {
    options: props => ({
      variables: { userId: props.userId },
    }),
  }),
)(UserApprovalPage);
