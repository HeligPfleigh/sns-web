import React, { Component, PropTypes } from 'react';
import { Modal, Button } from 'react-bootstrap';

class SharingPostModal extends Component {

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Chia sẻ bài viết</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Bạn có muốn chia sẻ bài viết này?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.closeModal}>Hủy</Button>
          <Button bsStyle="primary" onClick={this.props.clickModal}>Chia sẻ bài viết</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

SharingPostModal.propTypes = {
  show: PropTypes.bool,
  closeModal: PropTypes.func,
  clickModal: PropTypes.func,
};

export default SharingPostModal;
