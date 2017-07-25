import React, { Component, PropTypes } from 'react';
import { Modal } from 'react-bootstrap';

class RegisterModal extends Component {

  render() {
    const { title, onHide, buttons, closeButton, ...ownProps } = this.props;
    return (
      <Modal onHide={onHide} {...ownProps} >
        <Modal.Header closeButton={closeButton}>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          { this.props.children }
        </Modal.Body>
        <Modal.Footer>
          { buttons }
        </Modal.Footer>
      </Modal>
    );
  }
}

RegisterModal.propTypes = {
  closeButton: PropTypes.bool,
  ownProps: PropTypes.any,
  title: PropTypes.any,
  onHide: PropTypes.func,
  children: PropTypes.any,
  buttons: PropTypes.any,
};

export default RegisterModal;
