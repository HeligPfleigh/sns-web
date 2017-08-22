import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';

class DiscardChangesPostModal extends Component {

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Hủy thay đổi</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Bạn có chắc chắn muốn hủy thay đổi không?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.closeModal}>Không</Button>
          <Button bsStyle="primary" onClick={this.props.clickModal}>Hủy thay đổi</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

DiscardChangesPostModal.propTypes = {
  show: PropTypes.bool,
  closeModal: PropTypes.func,
  clickModal: PropTypes.func,
};


export default DiscardChangesPostModal;

