import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, FormGroup, Radio } from 'react-bootstrap';

class CancelEventModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedOption: 'cancelEvent',
    };
  }

  handleOptionChange = (changeEvent) => {
    this.setState({
      selectedOption: changeEvent.target.value,
    });
  }

  clickModal = (evt) => {
    evt.preventDefault();
    const { selectedOption } = this.state;
    const { eventId } = this.props;
    if (selectedOption === 'cancelEvent') {
      this.props.onCancel(eventId);
    }
    if (selectedOption === 'deleteEvent') {
      this.props.onDelete(eventId);
    }
  }

  render() {
    const {
      show,
      closeModal,
    } = this.props;
    const { selectedOption } = this.state;
    return (
      <Modal show={show} onHide={closeModal}>
        <form>
          <Modal.Header closeButton>
            <Modal.Title>Bạn muốn làm gì?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormGroup>
              <Radio
                name="radioGroup"
                value="cancelEvent"
                checked={selectedOption === 'cancelEvent'}
                onChange={this.handleOptionChange}
              >
                <span style={{ fontWeight: 'bold' }}>Hủy sự kiện</span>
                <p>Khách sẽ được thông báo rằng sự kiện này đã bị hủy. Bạn sẽ không thể sửa đổi sự kiện này</p>
              </Radio>
              <Radio
                name="radioGroup"
                value="deleteEvent"
                checked={selectedOption === 'deleteEvent'}
                onChange={this.handleOptionChange}
              >
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

