import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  Button,
  Col,
  Alert,
  ButtonToolbar,
  FormGroup,
  ControlLabel,
  Clearfix,
  Row,
 } from 'react-bootstrap';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import isString from 'lodash/isString';
import * as ReduxFormFields from '../../../components/ReduxForm';
import Validator from '../../../components/Validator';

class AddNewResidentModal extends Component {
  constructor(props, ...args) {
    super(props, ...args);

    this.state = {
      showModal: false,
      error: null,
      message: null,
    };

    this.formFields = {};
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      showModal: Object.keys(nextProps.initialValues).length > 0,
    });
  }

  onHide = () => {
    this.props.onHide();
  }

  onAddNew = () => {
    this.props.onAddNew({
      apartment: this.props.initialValues.apartment,
      building: this.props.initialValues.building,
    })
    .then(() => {
      this.onHide();
      this.onResetForm();
    })
    .catch(() => {
      this.props.onError('Có lỗi xảy ra trong quá trình thực hiện hành động này.');
      this.onHide();
      this.onResetForm();
    });
  }

  onSubmitForm = () => {

  }

  onResetForm = () => {
    const { dispatch, reset, form } = this.props;
    dispatch(reset(form));
  }

  render() {
    const { form, handleSubmit, currentValues, submitting, pristine, invalid } = this.props;
    const { message, error } = this.state;
    return (
      <Modal show={this.state.showModal} onHide={this.onHide} backdrop="static">
        <Modal.Header closeButton={!this.state.submitting}>
          <Modal.Title>Tạo mới cư dân cho căn hộ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {message && <Alert bsStyle={error ? 'danger' : 'success'}>{message}</Alert>}
          <form name={form} noValidate onSubmit={handleSubmit(this.onSubmitForm)}>
            <FormGroup controlId="username">
              <ControlLabel>Tên đăng nhập hệ thống</ControlLabel>
              <Field
                type="text"
                name="username"
                component={ReduxFormFields.InputField}
                validate={[
                  Validator.Required(null, 'Bạn phải nhập dữ liệu'),
                  Validator.AlphaDash(null, 'Giá trị chỉ có thể chứa chữ cái, số và dấu gạch ngang'),
                ]}
                ref={input => this.formFields.username = input}
                withRef
              />
            </FormGroup>

            <Row>
              <Col xs={6}>
                <FormGroup controlId="firstName">
                  <ControlLabel>Họ</ControlLabel>
                  <Field
                    type="text"
                    name="firstName"
                    component={ReduxFormFields.InputField}
                    validate={[
                      Validator.Alpha(null, 'Giá trị chỉ có thể chứa chữ cái'),
                    ]}
                    ref={input => this.formFields.firstName = input}
                    withRef
                  />
                </FormGroup>
              </Col>
              <Col xs={6}>
                <FormGroup controlId="lastName">
                  <ControlLabel>Tên</ControlLabel>
                  <Field
                    type="text"
                    name="lastName"
                    component={ReduxFormFields.InputField}
                    validate={[
                      Validator.Alpha(null, 'Giá trị chỉ có thể chứa chữ cái'),
                    ]}
                    ref={input => this.formFields.lastName = input}
                    withRef
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col xs={6}>
                <FormGroup controlId="email">
                  <ControlLabel>Địa chỉ email</ControlLabel>
                  <Field
                    type="email"
                    name="email"
                    component={ReduxFormFields.InputField}
                    validate={[
                      Validator.Required(null, 'Bạn phải nhập dữ liệu'),
                      Validator.Email(null, 'Địa chỉ email không đúng định dạng'),
                    ]}
                    ref={input => this.formFields.email = input}
                    withRef
                  />
                </FormGroup>
              </Col>
              <Col xs={6}>
                <FormGroup controlId="phone">
                  <ControlLabel>Số điện thoại</ControlLabel>
                  <Field
                    type="tel"
                    name="phone"
                    component={ReduxFormFields.InputField}
                    validate={[
                      Validator.Required(null, 'Bạn phải nhập dữ liệu'),
                      Validator.Alpha(null, 'Giá trị chỉ có thể chứa chữ cái, số và dấu gạch ngang'),
                    ]}
                    ref={input => this.formFields.phone = input}
                    withRef
                  />
                </FormGroup>
              </Col>
            </Row>

          </form>
          <Clearfix />
        </Modal.Body>
        <Modal.Footer>
          <ButtonToolbar>
            <ButtonToolbar className="pull-right">
              <Button type="button" onClick={this.onResetForm} disabled={pristine || submitting}>Nhập lại</Button>
              <Button type="submit" bsStyle="primary" disabled={pristine || submitting || invalid} onClick={this.onAddNew}>Tạo mới</Button>
            </ButtonToolbar>
          </ButtonToolbar>
        </Modal.Footer>
      </Modal>
    );
  }
}

AddNewResidentModal.propTypes = {
  initialValues: PropTypes.shape({
    apartment: PropTypes.string,
    building: PropTypes.string,
  }).isRequired,
  onHide: PropTypes.func.isRequired,
  onAddNew: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  form: PropTypes.string.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  currentValues: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
};

AddNewResidentModal.defaultProps = {
  onHide: () => undefined,
  onError: () => undefined,
};

const fields = [
  'apartment',
  'building',
  'username',
  'firstName',
  'lastName',
  'gender',
  'dob',
  'address',
];

const AddNewResidentForm = reduxForm({
  form: 'AddNewResidentForm',
  fields,
  touchOnChange: true,
  touchOnBlur: true,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
})(AddNewResidentModal);

export default compose(
  connect(state => ({
    user: state.user,
    currentValues: formValueSelector('AddNewResidentForm')(state, ...fields),
  })),
)(AddNewResidentForm);
