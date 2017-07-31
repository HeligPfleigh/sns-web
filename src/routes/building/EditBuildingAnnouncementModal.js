import React, { Component, PropTypes } from 'react';
import { Modal, Button, ControlLabel, FormControl, FormGroup } from 'react-bootstrap';

class EditBuildingAnnouncementModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      value: nextProps.message,
    });
  }

  handleChange = (evt) => {
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
            <FormGroup controlId="formControlsSelect">
              <ControlLabel>Select</ControlLabel>
              <FormControl componentClass="select" placeholder="select">
                <option value="TYPE1">TYPE1</option>
                <option value="TYPE2">TYPE2</option>
              </FormControl>
            </FormGroup>
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
          <Button bsStyle="primary" onClick={this.props.clickModal}>Chỉnh sửa</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

EditBuildingAnnouncementModal.propTypes = {
  message: PropTypes.string,
  type: PropTypes.string,
  show: PropTypes.bool,
  closeModal: PropTypes.func,
  clickModal: PropTypes.func,
};


export default EditBuildingAnnouncementModal;
