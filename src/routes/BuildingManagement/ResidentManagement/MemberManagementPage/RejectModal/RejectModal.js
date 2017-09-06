import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  Button,
  Col,
  ControlLabel,
  FormGroup,
  Clearfix,
  ButtonToolbar,
 } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { compose } from 'react-apollo';
import { reduxForm, Field } from 'redux-form';

import Validator from '../../../../../components/Validator';
import * as ReduxFormFields from '../../../../../components/ReduxForm';
import s from './RejectModal.scss';

class RejectModal extends Component {
  constructor(props, ...args) {
    super(props, ...args);

    this.state = {
      validationState: {},
      showModal: props.show,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      showModal: nextProps.show,
    });
  }

  onReject = ({ message }) => {
    this.onHide();
    const { requestsToJoinBuildingId, onReject } = this.props;
    onReject(requestsToJoinBuildingId, message);
    this.resetForm();
  }

  onHide = () => {
    this.props.onHide(false);
  }

  resetForm = () => {
    const { dispatch, reset, form } = this.props;
    dispatch(reset(form));
  }

  render() {
    const {
      handleSubmit,
      pristine,
      submitting,
      invalid,
      form,
    } = this.props;
    return (
      <Modal show={this.state.showModal} onHide={this.onHide} backdrop="static">
        <form name={form} noValidate onSubmit={handleSubmit(this.onReject)}>
          <Modal.Header closeButton={!submitting}>
            <Modal.Title>Lý do từ chối yêu cầu từ người dùng</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Col className="form-horizontal" xs={12}>
              <FormGroup validationState={this.state.validationState.message}>
                <ControlLabel className="col-sm-3">Lý do từ chối</ControlLabel>
                <Col sm={9}>
                  <Field
                    type="textarea"
                    name="message"
                    component={ReduxFormFields.EditorField}
                    className={s.editor}
                    validate={[Validator.Required(null, 'Hãy nhập lý do từ chối yêu cầu')]}
                  />
                </Col>
              </FormGroup>
            </Col>
            <Clearfix />
          </Modal.Body>
          <Modal.Footer>
            <ButtonToolbar>
              <ButtonToolbar className="pull-right">
                <Button onClick={this.onHide} disabled={submitting}>Đóng cửa sổ</Button>
                <Button type="submit" bsStyle="primary" disabled={pristine || submitting || invalid}>Hoàn tất</Button>
              </ButtonToolbar>
            </ButtonToolbar>
          </Modal.Footer>
        </form>
      </Modal>
    );
  }
}

RejectModal.propTypes = {
  onHide: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  form: PropTypes.any,
  reset: PropTypes.any,
  invalid: PropTypes.any,
  pristine: PropTypes.any,
  dispatch: PropTypes.any,
  submitting: PropTypes.any,
  handleSubmit: PropTypes.any,
  requestsToJoinBuildingId: PropTypes.any,
};

const fields = [
  'name',
  'message',
];

const RejectForm = reduxForm({
  form: 'RejectApprovalUser',
  fields,
  touchOnChange: true,
  touchOnBlur: true,
  enableReinitialize: true,
})(compose(
  withStyles(s),
)(RejectModal));

export default RejectForm;
