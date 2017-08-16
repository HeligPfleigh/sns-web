import React, { PropTypes } from 'react';
import { Row, Col, Clearfix, ButtonToolbar, ButtonGroup, Button, Image } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import history from '../../../core/history';
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
        requestInformation,
      },
    } = this.props;
    return (
      <Row className={s.item}>
        <Col xs={4} md={3}>
          <Image src={user.profile.picture || '/avatar-default.jpg'} thumbnail responsive />
        </Col>
        <Col xs={8} md={9}>
          <label className={s.fullName}>{`${user.profile.firstName} ${user.profile.lastName}`}</label>
          <div className={s.moreInfo}>
            {/* { user.apartments.map(apartment => (
              <div key={apartment._id}><small><i>Căn hộ số #{ apartment.number }, thuộc tòa nhà { apartment.building.name }</i></small></div>
            )) } */}
            <div><small><i>Số điện thoại: { user.phone ? user.phone.number : 'None' }</i></small></div>
            <div><small><i>Email: { user.emails ? user.emails.address : 'None' }</i></small></div>
          </div>

          <ButtonToolbar>
            <Button title="Xem thông tin của thành viên" bsStyle="info" bsSize="xsmall" onClick={this.useDetail}>
              <i className="fa fa-info-circle" /> Xem thông tin
            </Button>
            <ButtonGroup>
              <Button title="Chấp nhận là thành viên của tòa nhà" bsStyle="primary" bsSize="xsmall" onClick={this.approveUser}>
                <i className="fa fa-check" /> Đồng ý
              </Button>
              <Button title="Không chấp nhận là thành viên của tòa nhà" bsStyle="danger" bsSize="xsmall" onClick={this.rejectUser}>
                <i className="fa fa-remove" /> Từ chối
              </Button>
            </ButtonGroup>
          </ButtonToolbar>
        </Col>
        <Clearfix />
      </Row>
    );
  }
}

User.propTypes = {
  edge: PropTypes.shape({
    _id: PropTypes.string,
    user: PropTypes.object,
    requestInformation: PropTypes.object,
  }).isRequired,
  onAccept: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};


User.defaultProps = {
  edge: {},
};

export default withStyles(s)(User);

