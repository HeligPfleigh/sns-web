import React, { Component, PropTypes } from 'react';
import { Modal, Button } from 'react-bootstrap';

class EditBuildingAnnouncementModal extends Component {

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa thông báo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Chỉnh sửa thông báo.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.closeModal}>Hủy</Button>
          <Button bsStyle="primary" onClick={this.props.clickModal}>Xóa bài viết</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

EditBuildingAnnouncementModal.propTypes = {
  show: PropTypes.bool,
  closeModal: PropTypes.func,
  clickModal: PropTypes.func,
};


export default EditBuildingAnnouncementModal;
