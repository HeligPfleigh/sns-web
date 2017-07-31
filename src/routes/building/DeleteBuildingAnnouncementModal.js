import React, { Component, PropTypes } from 'react';
import { Modal, Button } from 'react-bootstrap';

class DeleteBuildingAnnouncementModal extends Component {

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Xóa thông báo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Bạn có muốn xóa thông báo này không?.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.closeModal}>Hủy</Button>
          <Button bsStyle="primary" onClick={this.props.clickModal}>Xóa thông báo</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

DeleteBuildingAnnouncementModal.propTypes = {
  show: PropTypes.bool,
  closeModal: PropTypes.func,
  clickModal: PropTypes.func,
};


export default DeleteBuildingAnnouncementModal;
