import React, { Component, PropTypes } from 'react';
import { Modal, Button, ControlLabel, FormControl, FormGroup } from 'react-bootstrap';

class EditBuildingAnnouncementModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.message,
    };
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      value: nextProps.message,
    });
  }

  onClick = (evt) => {
    evt.preventDefault();
    this.props.clickModal(this.state.value);
  }

  handleChange = (evt) => {
    evt.preventDefault();
    this.setState({ value: evt.target.value });
  }

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa thông báo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <FormGroup>
              <ControlLabel>Message</ControlLabel>
              <FormControl
                type="text"
                value={this.state.value}
                placeholder="Enter Text"
                onChange={this.handleChange}
              />
            </FormGroup>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.closeModal}>Hủy</Button>
          <Button bsStyle="primary" onClick={this.onClick}>Chỉnh sửa</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

EditBuildingAnnouncementModal.propTypes = {
  message: PropTypes.string,
  show: PropTypes.bool,
  closeModal: PropTypes.func,
  clickModal: PropTypes.func,
};


export default EditBuildingAnnouncementModal;
