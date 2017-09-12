import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  Button,
  Col,
  ButtonToolbar,
 } from 'react-bootstrap';
import { compose } from 'react-apollo';

class DeleteResidentModal extends Component {
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
    this.props.onHide();
  }

  onDelete() {
    this.setState({
      submitting: true,
    });
    this.props.onDelete({
      resident: this.props.initialValues.resident,
      apartment: this.props.initialValues.apartment,
      building: this.props.initialValues.building,
    })
    .then(() => {
      this.onHide();
      this.resetForm();
    })
    .catch(() => {
      this.props.onError('Có lỗi xảy ra trong quá trình thực hiện hành động này.');
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
    return (
      <Modal show={this.state.showModal} onHide={this.onHide} backdrop="static">
        <Modal.Header closeButton={!this.state.submitting}>
          <Modal.Title>Loại bỏ cư dân ra khỏi căn hộ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Col className="text-center">Bạn có chắc muốn thực hiện hành động này không?</Col>
        </Modal.Body>
        <Modal.Footer>
          <ButtonToolbar>
            <ButtonToolbar className="pull-right">
              <Button onClick={this.onHide} disabled={this.state.submitting}>Không</Button>
              <Button type="submit" bsStyle="danger" disabled={this.state.submitting} onClick={this.onDelete}>Tiếp tục</Button>
            </ButtonToolbar>
          </ButtonToolbar>
        </Modal.Footer>
      </Modal>
    );
  }
}

DeleteResidentModal.propTypes = {
  initialValues: PropTypes.shape({
    resident: PropTypes.string,
    apartment: PropTypes.string,
    building: PropTypes.string,
  }).isRequired,
  onHide: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
};

DeleteResidentModal.defaultProps = {
  onHide: () => undefined,
  onError: () => undefined,
};

export default compose()(DeleteResidentModal);
