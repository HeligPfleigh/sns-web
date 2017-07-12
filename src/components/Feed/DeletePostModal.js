import React, { Component, PropTypes } from 'react';
import { Modal, Button } from 'react-bootstrap';

class DeletePostModal extends Component {

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Xóa bài viết</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Bài viết này sẽ bị xóa và bạn sẽ không thể tìm thấy nữa. Bạn cũng có thể chỉnh sửa bài viết nếu chỉ muốn thay đổi nội dung nào đó.
            Nếu bạn không tạo bài viết này, chúng tôi có thể giúp bạn bảo vệ tài khoản.
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

DeletePostModal.propTypes = {
  show: PropTypes.bool,
  closeModal: PropTypes.func,
  clickModal: PropTypes.func,
};


export default DeletePostModal;

