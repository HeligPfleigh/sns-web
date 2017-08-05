import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import { Grid, Row, Col } from 'react-bootstrap';
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
        <Grid>
          <Row>
            <Col md={8} sm={12} xs={12} className={s.profile}>
              <div className={s.backBuildingRequestTab} onClick={this.backBuildingRequestTab}>
                <i className="fa fa-chevron-left" aria-hidden="true"></i>
                <h4>Quay lại trang</h4>
              </div>
              <h3>THÔNG TIN</h3>
              {!requestsToJoinBuilding &&
                <h4>
                  Không tìm thấy thông tin yêu cầu xin vào tòa nhà
                </h4>
              }
              {requestsToJoinBuilding && user && building &&
              <div>
                <ul>
                  <li>
                    <div className={s.pullLeft}>
                      <i className="fa fa-user-circle" aria-hidden="true"></i>
                      <label htmlFor="name">Name</label>
                    </div>
                    <div className={s.pullRight}>
                      <span>{user.profile && generateFullname(user.profile)}</span>
                    </div>
                  </li>
                  <li>
                    <div className={s.pullLeft}>
                      <i className="fa fa-mobile" aria-hidden="true"></i>
                      <label htmlFor="phoneNumber">Số điện thoại</label>
                    </div>
                    <div className={s.pullRight}>
                      <span>{ user.phone && user.phone.number }</span>
                    </div>
                  </li>
                  <li>
                    <div className={s.pullLeft}>
                      <i className="fa fa-building" aria-hidden="true"></i>
                      <label htmlFor="address">Địa chỉ</label>
                    </div>
                    <div className={s.pullRight}>
                      <span>
                        {requestsToJoinBuilding.requestInformation.apartment.number}
                        {getAddress(building.address)}
                      </span>
                    </div>
                  </li>
                  <li>
                    <div className={s.pullLeft}>
                      <i className="fa fa-envelope-o" aria-hidden="true"></i>
                      <label htmlFor="email">Email</label>
                    </div>
                    <div className={s.pullRight}>
                      <span>{ user.emails && user.emails.address }</span>
                    </div>
                  </li>
                  <li>
                    <div className={s.pullLeft}>
                      <i className="fa fa-venus-mars" aria-hidden="true"></i>
                      <label htmlFor="gender">Giới Tính</label>
                    </div>
                    <div className={s.pullRight}>
                      <span>{user.profile && user.profile.gender === 'male' ? 'Nam' : 'Nữ'}</span>
                    </div>
                  </li>
                  <li>
                    <div className={s.pullLeft}>
                      <i className="fa fa-birthday-cake" aria-hidden="true"></i>
                      <label htmlFor="birthday">Ngày sinh</label>
                    </div>
                    <div className={s.pullRight}>
                      <span>None</span>
                    </div>
                  </li>
                </ul>
              </div>
              }
              {requestsToJoinBuilding && requestsToJoinBuilding.status === PENDING &&
                <div>
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
                </div>}
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

UserApprovalPage.propTypes = {
  data: PropTypes.shape({}).isRequired,
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
