import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import { Grid, Row, Col, ControlLabel } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import userApprovalPageQuery from './userApprovalPageQuery.graphql';
import rejectingUserToBuildingMutation from './rejectingUserToBuildingMutation.graphql';
import approvingUserToBuildingMutation from './approvingUserToBuildingMutation.graphql';
import {
  PENDING,
} from '../../constants';
import { openAlertGlobal } from '../../reducers/alert';
import s from './UserApprovalPage.scss';

function generateFullname({ firstName, lastName }) {
  return `${lastName} ${firstName}`;
}

function getAddress({
  basisPoint,
  province,
  district,
  ward,
  street,
}) {
  return ` ${basisPoint}, ${street} - ${ward} - ${district} - ${province}`;
}

class UserApprovalPage extends Component {

  backBuildingRequestTab = () => history.back()

  acceptUser = (evt) => {
    evt.preventDefault();
    const {
      data: { requestsToJoinBuilding },
      approvingUserToBuilding,
      openAlertGlobalAction,
    } = this.props;
    approvingUserToBuilding(requestsToJoinBuilding._id)
    .then(() => {
      openAlertGlobalAction({
        message: 'Bạn đã xác nhận yêu cầu của user thành công',
        open: true,
        autoHideDuration: 0,
      });
    }).catch((error) => {
      console.log('there was an error sending the query', error);
    });
  }

  rejectUser = (evt) => {
    evt.preventDefault();
    const {
      data: { requestsToJoinBuilding },
      rejectingUserToBuilding,
      openAlertGlobalAction,
    } = this.props;
    rejectingUserToBuilding(requestsToJoinBuilding._id)
    .then(() => {
      openAlertGlobalAction({
        message: 'Bạn đã hủy yêu cầu của user thành công',
        open: true,
        autoHideDuration: 0,
      });
    }).catch((error) => {
      console.log('there was an error sending the query', error);
    });
  }

  render() {
    const { data: { loading, requestsToJoinBuilding } } = this.props;
    let user = null;
    let building = null;
    if (!loading && requestsToJoinBuilding) {
      user = requestsToJoinBuilding.user;
      building = requestsToJoinBuilding.building;
    }
    return (
      <div>
        {!requestsToJoinBuilding && <h3>
          Không tìm thấy thông tin yêu cầu của người dùng xin vào tòa nhà
        </h3>}
        {requestsToJoinBuilding && user && building &&
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
                    {user.profile && generateFullname(user.profile)}
                  </Col>
                </Row>
                <Row className={s.profileInfo}>
                  <Col sm={3}>
                    <i className="fa fa-mobile" aria-hidden="true"></i>
                    <ControlLabel htmlFor="phoneNumber">Số điện thoại</ControlLabel>
                  </Col>
                  <Col sm={9} className={s.profileRight}>
                    { user.phone && user.phone.number }
                  </Col>
                </Row>
                <Row className={s.profileInfo}>
                  <Col sm={3}>
                    <i className="fa fa-building" aria-hidden="true"></i>
                    <ControlLabel htmlFor="address">Địa chỉ</ControlLabel>
                  </Col>
                  <Col sm={9} className={s.profileRight}>
                    {requestsToJoinBuilding.requestInformation.apartment.number}
                    {getAddress(building.address)}
                  </Col>
                </Row>
                <Row className={s.profileInfo}>
                  <Col sm={3}>
                    <i className="fa fa-envelope-o" aria-hidden="true"></i>
                    <ControlLabel htmlFor="email">Email</ControlLabel>
                  </Col>
                  <Col sm={9} className={s.profileRight}>
                    { user.emails && user.emails.address }
                  </Col>
                </Row>
                <Row className={s.profileInfo}>
                  <Col sm={3}>
                    <i className="fa fa-venus-mars" aria-hidden="true"></i>
                    <ControlLabel htmlFor="gender">Giới Tính</ControlLabel>
                  </Col>
                  <Col sm={9} className={s.profileRight}>
                    {user.profile && user.profile.gender === 'male' ? 'Nam' : 'Nữ'}
                  </Col>
                </Row>
                <Row className={s.profileInfo}>
                  <Col sm={3}>
                    <i className="fa fa-birthday-cake" aria-hidden="true"></i>
                    <ControlLabel htmlFor="email">Ngày sinh</ControlLabel>
                  </Col>
                  <Col sm={9} className={s.profileRight}>
                    None
                  </Col>
                </Row>

                { requestsToJoinBuilding.status === PENDING && <Row>
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
                </Row>}
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
    // resident: PropTypes.shape({
    //   _id: PropTypes.string.isRequired,
    //   username: PropTypes.string.isRequired,
    //   profile: PropTypes.shape({
    //     picture: PropTypes.string.isRequired,
    //     firstName: PropTypes.string.isRequired,
    //     lastName: PropTypes.string.isRequired,
    //     gender: PropTypes.string.isRequired,
    //   }),
    // }),
  }).isRequired,
  approvingUserToBuilding: PropTypes.func.isRequired,
  rejectingUserToBuilding: PropTypes.func.isRequired,
  openAlertGlobalAction: PropTypes.func.isRequired,
};

export default compose(
  withStyles(s),
  graphql(userApprovalPageQuery, {
    options: props => ({
      variables: {
        requestId: props.requestId,
      },
    }),
  }),
  graphql(approvingUserToBuildingMutation, {
    props: ({ mutate }) => ({
      approvingUserToBuilding: id => mutate({
        variables: {
          input: {
            requestsToJoinBuildingId: id,
          },
        },
      }),
    }),
  }),
  graphql(rejectingUserToBuildingMutation, {
    props: ({ mutate }) => ({
      rejectingUserToBuilding: id => mutate({
        variables: {
          input: {
            requestsToJoinBuildingId: id,
          },
        },
      }),
    }),
  }),
)(connect(
  null,
  { openAlertGlobalAction: openAlertGlobal },
)(UserApprovalPage));
