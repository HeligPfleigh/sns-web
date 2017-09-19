import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, FormGroup, Radio } from 'react-bootstrap';
import history from '../../../core/history';

class CancelEventModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isCancelEvent: false,
      isDeleteEvent: false,
    };
  }

  onCancelEvent = () => {
    this.setState({
      isCancelEvent: true,
      isDeleteEvent: false,
    });
  }

  onDeleteEvent = () => {
    this.setState({
      isCancelEvent: false,
      isDeleteEvent: true,
    });
  }

  clickModal = (evt) => {
    evt.preventDefault();
    const { isCancelEvent, isDeleteEvent } = this.state;
    const { eventId } = this.props;
    if (isCancelEvent) {
      this.props.onCancel(eventId);
    }
    if (isDeleteEvent) {
      this.props.onDelete(eventId).then(() => {
        history.push('/events');
      });
    }
  }

  render() {
    const {
      show,
      closeModal,
    } = this.props;
    return (
      <Modal show={show} onHide={closeModal}>
        <form>
          <Modal.Header closeButton>
            <Modal.Title>Bạn muốn làm gì?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormGroup>
              <Radio name="radioGroup" onClick={this.onCancelEvent}>
                <span style={{ fontWeight: 'bold' }}>Hủy sự kiện</span>
                <p>Khách sẽ được thông báo rằng sự kiện này đã bị hủy. Bạn sẽ không thể sửa đổi sự kiện này</p>
              </Radio>
              <Radio name="radioGroup" onClick={this.onDeleteEvent}>
                <span style={{ fontWeight: 'bold' }}>Xóa sự kiện</span>
                <p>Khách sẽ được thông báo rằng sự kiện này đã bị hủy và mọi nội dung đăng lên sẽ bị xóa.</p>
              </Radio>
            </FormGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={closeModal}>Hủy</Button>
            <Button bsStyle="primary" onClick={this.clickModal}>Chấp nhận</Button>
          </Modal.Footer>
        </form>
      </Modal>
    );
  }
}

CancelEventModal.propTypes = {
  eventId: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};


export default CancelEventModal;

