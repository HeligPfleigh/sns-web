import React, { PropTypes, Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {
  FormGroup,
  ControlLabel,
  FormControl,
  Button,
} from 'react-bootstrap';
import s from './NewAnnouncement.scss';

export class NewAnnouncement extends Component {

  render() {
    return (
      <form>
        <FormGroup controlId="formControlsSelect">
          <ControlLabel>Kiểu thông báo</ControlLabel>
          <FormControl componentClass="select" placeholder="select">
            <option value="type01">Kiểu thông báo 01</option>
            <option value="type02">Kiểu thông báo 02</option>
            <option value="type03">Kiểu thông báo 03</option>
          </FormControl>
        </FormGroup>
        <FormGroup>
          <ControlLabel>Tiêu đề</ControlLabel>
          <FormControl
            type="text"
            placeholder="Tiêu đề của thông báo"
          />
        </FormGroup>
        <FormGroup controlId="formControlsTextarea">
          <ControlLabel>Nội dung</ControlLabel>
          <FormControl componentClass="textarea" placeholder="Nội dung của thông báo" />
        </FormGroup>
        <Button bsStyle="primary" style={{ float: 'right' }}>
          Đăng thông báo
        </Button>
      </form>
    );
  }
}

NewAnnouncement.propTypes = {
};

export default withStyles(s)(NewAnnouncement);
