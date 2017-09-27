import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {
  Row,
  Col,
  Alert,
  Image,
  Button,
  Clearfix,
  ButtonToolbar,
} from 'react-bootstrap';

import history from '../../../../../core/history';
import {
  ACCEPTED,
  REJECTED,
  PENDING,
} from '../../../../../constants';
import RejectModal from '../RejectModal';
import s from './UserAwaitingApproval.scss';

class User extends React.Component {

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

  approveUser = (evt) => {
    const requestsToJoinBuildingId = this.props.edge._id;
    this.props.onAccept(evt, requestsToJoinBuildingId);
  }

  useDetail = (evt) => {
    evt.preventDefault();
    const requestsToJoinBuildingId = this.props.edge._id;
    const { buildingId } = this.props;
    const url = `/management/${buildingId}/resident/approve_member/${requestsToJoinBuildingId}`;
    history.push(url);
  }

  render() {
    const {
      edge: {
        _id,
        user,
        status,
        requestInformation: {
          apartments,
        },
      },
      onCancel,
    } = this.props;
    return (
      <div className={s.item}>
        { user && status &&
          <Row>
            <Col xs={3} md={2}>
              <Image
                circle
                thumbnail responsive
                src={user.profile.picture || '/avatar-default.jpg'}
                className={s.avarta}
              />
            </Col>
            <Col xs={9} md={10}>
              <label className={s.fullName}>{`${user.profile.firstName} ${user.profile.lastName}`}</label>
              <div className={s.moreInfo}>
                <div>
                  <small>
                    <i>Căn hộ:
                      { apartments.map(apartment => (
                        <i key={Math.random()}> {apartment.name} </i>
                      ))}
                    </i>
                  </small>
                </div>
                { status === PENDING && <div><small><i>Trạng thái: Đang chờ phê duyệt</i></small></div> }
                { status === ACCEPTED && <div style={{ color: '#337ab7' }}><small><i>Trạng thái: Đã đồng ý</i></small></div> }
                { status === REJECTED && <div style={{ color: '#d9534f' }}><small><i>Trạng thái: Không đồng ý</i></small></div> }
              </div>

              <ButtonToolbar>
                <Button title="Xem thông tin của thành viên" bsStyle="primary" onClick={this.useDetail}>
                  <i className="fa fa-info-circle" /> Xem thông tin
                </Button>
                { status === PENDING &&
                  <span>
                    <Button title="Chấp nhận là thành viên của tòa nhà" bsStyle="primary" onClick={this.approveUser}>
                      <i className="fa fa-check" /> Đồng ý
                    </Button>
                    <Button title="Không chấp nhận là thành viên của tòa nhà" bsStyle="default" onClick={this.onToggleModal}>
                      <i className="fa fa-remove" /> Từ chối
                    </Button>
                  </span>
                }
              </ButtonToolbar>
            </Col>
            <Clearfix />
          </Row>
        }
        {this.state.errorMessage && (<Alert bsStyle="danger" onDismiss={() => this.setState({ errorMessage: false })}>
          { this.state.errorMessage }
        </Alert>)}
        { this.state.showModal && <RejectModal
          requestsToJoinBuildingId={_id}
          onReject={onCancel}
          show={this.state.showModal}
          onHide={this.onToggleModal}
        /> }
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
  buildingId: PropTypes.string.isRequired,
};

export default withStyles(s)(User);
