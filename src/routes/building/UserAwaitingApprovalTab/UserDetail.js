import React, { Component, PropTypes } from 'react';
import { Modal, Button } from 'react-bootstrap';

class UserDetail extends Component {

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Thông tin thành viên</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Bài viết này sẽ bị xóa và bạn sẽ không thể tìm thấy nữa. Bạn cũng có thể chỉnh sửa bài viết nếu chỉ muốn thay đổi nội dung nào đó.
            Nếu bạn không tạo bài viết này, chúng tôi có thể giúp bạn bảo vệ tài khoản.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button bsClass="default" onClick={this.props.onCancel}>Từ chối</Button>
          <Button bsClass="primary" onClick={ this.props.onAccept }>Đồng ý</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

UserDetail.propTypes = {
  show: PropTypes.bool,
  closeModal: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onAccept: PropTypes.func.isRequired,
};


export default UserDetail;

