import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';

class DeleteAnnouncementModal extends Component {

  onClick = evt => this.props.clickModal(evt, {});

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Xóa thông báo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Thông báo này sẽ bị xóa và bạn sẽ không thể tìm thấy nữa. Bạn cũng có thể chỉnh sửa thông báo nếu chỉ muốn thay đổi nội dung nào đó.
            Nếu bạn không tạo thông báo này, chúng tôi có thể giúp bạn bảo vệ tài khoản.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.closeModal}>Hủy</Button>
          <Button bsStyle="primary" onClick={this.onClick}>Xóa thông báo</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

DeleteAnnouncementModal.propTypes = {
  show: PropTypes.bool,
  closeModal: PropTypes.func,
  clickModal: PropTypes.func,
};


export default DeleteAnnouncementModal;

