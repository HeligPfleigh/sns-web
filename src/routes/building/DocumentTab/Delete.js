import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  Button,
  Col,
  ButtonToolbar,
 } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { compose } from 'react-apollo';

import s from './Document.scss';

class DeleteDocumentModal extends Component {
  constructor(props, ...args) {
    super(props, ...args);

    this.state = {
      submitting: false,
      showModal: false,
    };

    this.onHide = this.onHide.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.resetForm = this.resetForm.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      showModal: Object.keys(nextProps.initialValues).length > 0,
    });
  }

  onHide() {
    this.props.onHide({});
  }

  onDelete() {
    this.setState({
      submitting: true,
    });
    this.props.onDelete({
      _id: this.props.initialValues._id,
      building: this.props.initialValues.building._id,
    })
    .then(() => {
      this.onHide();
      this.resetForm();
    })
    .catch(() => {
      this.props.onError('Có lỗi xảy ra trong quá trình xóa biểu mẫu');
      this.onHide();
      this.resetForm();
    });
  }

  resetForm() {
    this.setState({
      submitting: false,
    });
  }

  render() {
    const { canDelete } = this.props;
    return (
      <Modal show={this.state.showModal} onHide={this.onHide} backdrop="static">
        <Modal.Header closeButton={!this.state.submitting}>
          <Modal.Title>Xóa biểu mẫu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Col>Bạn có chắc muốn xóa biểu mẫu này không?</Col>
        </Modal.Body>
        <Modal.Footer>
          <ButtonToolbar>
            <ButtonToolbar className="pull-right">
              <Button onClick={this.onHide} disabled={this.state.submitting}>Đóng cửa sổ</Button>
              <Button type="submit" bsStyle="primary" disabled={!canDelete || this.state.submitting} onClick={this.onDelete}>Xóa biểu mẫu</Button>
            </ButtonToolbar>
          </ButtonToolbar>
        </Modal.Footer>
      </Modal>
    );
  }
}

DeleteDocumentModal.propTypes = {
  building: PropTypes.shape({
    _id: PropTypes.string,
    isAdmin: PropTypes.bool,
  }).isRequired,
  onHide: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  canUpdate: PropTypes.bool.isRequired,
  canDelete: PropTypes.bool.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

DeleteDocumentModal.defaultProps = {
  initialValues: {},
  canUpdate: false,
  canDelete: false,
  onHide: () => undefined,
};

export default compose(
  withStyles(s),
)(DeleteDocumentModal);
