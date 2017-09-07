import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import { graphql, compose } from 'react-apollo';
import { Alert, Grid, Row, Col } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import s from './UserApprovalPage.scss';
import { PENDING } from '../../../../../constants';
import Loading from '../../../../../components/Loading';
import Menu from '../../../Menu/Menu';
import RejectModal from '../RejectModal';
import { openAlertGlobal } from '../../../../../reducers/alert';
import userApprovalPageQuery from '../graphql/UserDetailApprovalQuery.graphql';
import rejectingUserToBuildingMutation from '../graphql/rejectingUserToBuildingMutation.graphql';
import approvingUserToBuildingMutation from '../graphql/approvingUserToBuildingMutation.graphql';

function generateFullname({ firstName, lastName }) {
  return `${lastName} ${firstName}`;
}

// eslint-disable-next-line
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

  constructor(props) {
    super(props);

    this.state = {
      errorMessage: null,
      showModal: false,
    };
  }

  onToggleModal = () => {
    this.setState({
      showModal: !this.state.showModal,
    });
  }

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

  rejectUser = (requestsToJoinBuildingId, message) => {
    const {
      rejectingUserToBuilding,
      openAlertGlobalAction,
    } = this.props;
    rejectingUserToBuilding(requestsToJoinBuildingId, message)
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
    const {
      userMenu,
      data: {
        loading,
        requestsToJoinBuilding,
      },
    } = this.props;

    if (loading) {
      return <Loading show={loading} full>Đang tải ...</Loading>;
    }

    let user = null;
    let building = null;
    let requestInformation = null;
    if (!loading && requestsToJoinBuilding) {
      user = requestsToJoinBuilding.user;
      building = requestsToJoinBuilding.building;
      requestInformation = requestsToJoinBuilding.requestInformation;
    }

    return (
      <Grid>
        <Row className={classNames(s.containerTop30)}>
          <MediaQuery minDeviceWidth={992} values={{ deviceWidth: 1600 }}>
            <Col md={3} smHidden xsHidden>
              <Menu
                user={userMenu}
                parentPath={`/management/${building && building._id}`}
                pageKey="resident_management>approve_member"
              />
            </Col>
          </MediaQuery>
          <Col md={9} sm={12} xs={12}>
            <Row className={classNames(s.container)}>
              <div onClick={this.backBuildingRequestTab}>
                <i className="fa fa-chevron-left" aria-hidden="true"></i>
                <h4>Quay lại trang</h4>
              </div>
              <h3>THÔNG TIN</h3>
              {!requestsToJoinBuilding &&
                <h4>
                  Không tìm thấy thông tin yêu cầu xin vào tòa nhà
                </h4>
              }
              {requestsToJoinBuilding && user && building && requestInformation &&
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
                        Căn hộ { requestInformation.apartments.map(apartment => (
                          <span key={Math.random()}> {apartment.name}, </span>
                        ))}
                      </span>
                      Tòa nhà { building.name }
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
                    onClick={this.onToggleModal}
                    className={s.buttonCancel}
                  >
                    Từ chối
                  </button>
                </div>}
            </Row>
          </Col>
        </Row>
        {
          this.state.errorMessage && (
            <Alert
              bsStyle="danger"
              onDismiss={() => this.setState({ errorMessage: false })}
            >
              { this.state.errorMessage }
            </Alert>
          )
        }
        {
          this.state.showModal && (
            <RejectModal
              onReject={this.rejectUser}
              show={this.state.showModal}
              onHide={this.onToggleModal}
              requestsToJoinBuildingId={requestsToJoinBuilding._id}
            />
          )
        }
      </Grid>
    );
  }
}

UserApprovalPage.propTypes = {
  userMenu: PropTypes.object,
  data: PropTypes.shape({}).isRequired,
  approvingUserToBuilding: PropTypes.func.isRequired,
  rejectingUserToBuilding: PropTypes.func.isRequired,
  openAlertGlobalAction: PropTypes.func.isRequired,
};

export default compose(
  withStyles(s),
  connect(state => ({
    userMenu: state.user,
  }), {
    openAlertGlobalAction: openAlertGlobal,
  }),
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
      rejectingUserToBuilding: (id, message) => mutate({
        variables: {
          input: {
            requestsToJoinBuildingId: id,
            message,
          },
        },
      }),
    }),
  }),
)(UserApprovalPage);
