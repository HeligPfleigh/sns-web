import React, { PropTypes } from 'react';
import { Row, Col, Clearfix, ButtonToolbar, ButtonGroup, Button, Image } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import history from '../../../core/history';
import {
  ACCEPTED,
  REJECTED,
  PENDING,
} from '../../../constants';
import s from './UserAwaitingApproval.scss';

class User extends React.Component {

  approveUser = (evt) => {
    const requestsToJoinBuildingId = this.props.edge._id;
    this.props.onAccept(evt, requestsToJoinBuildingId);
  }

  rejectUser = (evt) => {
    const requestsToJoinBuildingId = this.props.edge._id;
    this.props.onCancel(evt, requestsToJoinBuildingId);
  }

  useDetail = (evt) => {
    evt.preventDefault();
    const requestsToJoinBuildingId = this.props.edge._id;
    history.push(`/user-approval/${requestsToJoinBuildingId}`);
  }

  render() {
    const {
      edge: {
        user,
        status,
        requestInformation: {
          apartments,
        },
      },
    } = this.props;
    return (
      <div className={s.item}>
        { user && status &&
          <Row>
            <Col xs={4} md={3}>
              <Image src={user.profile.picture || '/avatar-default.jpg'} thumbnail responsive />
            </Col>
            <Col xs={8} md={9}>
              <label className={s.fullName}>{`${user.profile.firstName} ${user.profile.lastName}`}</label>
              <div className={s.moreInfo}>
                <div>
                  <small>
                    <i>Địa chỉ:
                      Căn hộ { apartments.map(apartment => (
                        <i key={Math.random()}> {apartment.name} </i>
                      ))}
                    </i>
                  </small>
                </div>
                <div><small><i>Số điện thoại: { user.phone ? user.phone.number : 'None' }</i></small></div>
                <div><small><i>Email: { user.emails ? user.emails.address : 'None' }</i></small></div>
                { status === PENDING && <div><small><i>Trạng thái: Đang chờ phê duyệt</i></small></div> }
                { status === ACCEPTED && <div style={{ color: '#337ab7' }}><small><i>Trạng thái: Đã đồng ý</i></small></div> }
                { status === REJECTED && <div style={{ color: '#d9534f' }}><small><i>Trạng thái: Không đồng ý</i></small></div> }
              </div>

              <ButtonToolbar>
                <Button title="Xem thông tin của thành viên" bsStyle="info" bsSize="xsmall" onClick={this.useDetail}>
                  <i className="fa fa-info-circle" /> Xem thông tin
                </Button>
                { status === PENDING &&
                  <ButtonGroup>
                    <Button title="Chấp nhận là thành viên của tòa nhà" bsStyle="primary" bsSize="xsmall" onClick={this.approveUser}>
                      <i className="fa fa-check" /> Đồng ý
                    </Button>
                    <Button title="Không chấp nhận là thành viên của tòa nhà" bsStyle="danger" bsSize="xsmall" onClick={this.rejectUser}>
                      <i className="fa fa-remove" /> Từ chối
                    </Button>
                  </ButtonGroup>
                }
              </ButtonToolbar>
            </Col>
            <Clearfix />
          </Row>
        }
      </div>
    );
  }
}

User.propTypes = {
  edge: PropTypes.shape({
    _id: PropTypes.string,
    user: PropTypes.object,
    status: PropTypes.string,
    building: PropTypes.object,
    requestInformation: PropTypes.object,
  }).isRequired,
  onAccept: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};


User.defaultProps = {
  edge: {},
};

export default withStyles(s)(User);

