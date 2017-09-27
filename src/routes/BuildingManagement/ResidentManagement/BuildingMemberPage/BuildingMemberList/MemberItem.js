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

import RejectModal from '../RejectModal';
import history from '../../../../../core/history';
import s from './MemberList.scss';

class MemberItem extends React.Component {

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

  userDetail = (evt) => {
    evt.preventDefault();
    const { _id: userId, building: { _id: buildingId } } = this.props.data;
    history.push(`/management/${buildingId}/resident/detail/${userId}`);
  }

  updateUserInfo = (evt) => {
    evt.preventDefault();
    const { _id: userId, building: { _id: buildingId } } = this.props.data;
    history.push(`/management/${buildingId}/resident/change_info/${userId}`);
  }

  render() {
    const {
      data: {
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
              </div>

              <ButtonToolbar>
                <Button title="Cập nhật thông tin thành viên" bsStyle="primary" onClick={this.updateUserInfo}>
                  <i className="fa fa-edit" /> Sửa
                </Button>
                <Button title="Xem thông tin của thành viên" bsStyle="primary" onClick={this.userDetail}>
                  <i className="fa fa-info-circle" /> Xem thông tin
                </Button>
                <Button title="Xóa thành viên ra khỏi tòa nhà" bsStyle="default" onClick={this.onToggleModal}>
                  <i className="fa fa-trash" /> Xóa
                </Button>
              </ButtonToolbar>
            </Col>
            <Clearfix />
          </Row>
        }
        {this.state.errorMessage && (<Alert bsStyle="danger" onDismiss={() => this.setState({ errorMessage: false })}>
          { this.state.errorMessage }
        </Alert>)}
        { this.state.showModal && <RejectModal
          memberId={_id}
          onReject={onCancel}
          show={this.state.showModal}
          onHide={this.onToggleModal}
        /> }
      </div>
    );
  }
}

MemberItem.propTypes = {
  data: PropTypes.shape({
    _id: PropTypes.string,
    user: PropTypes.object,
    status: PropTypes.string,
    building: PropTypes.object,
    requestInformation: PropTypes.object,
  }).isRequired,
  onCancel: PropTypes.func.isRequired,
};


MemberItem.defaultProps = {
  data: {},
};

export default withStyles(s)(MemberItem);
