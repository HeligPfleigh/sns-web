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
  HelpBlock,
 } from 'react-bootstrap';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import throttle from 'lodash/throttle';
import toString from 'lodash/toString';
import { reduxForm, Field, formValueSelector, SubmissionError } from 'redux-form';
import * as ReduxFormFields from '../../../components/ReduxForm';
import Validator from '../../../components/Validator';

class AddNewResidentModal extends Component {
  constructor(props, ...args) {
    super(props, ...args);

    this.state = {
      showModal: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { initialValues } = nextProps;
    this.setState({
      showModal: Object.keys(initialValues).length > 0,
    });
  }

  onHide = () => {
    this.props.onHide();
  }

  onGeneratePhoneToUsername = throttle((event, value) => {
    const { change, currentValues } = this.props;
    change('usageUsernameAsPhoneNumber', !Validator.Required.validate(currentValues.username) && Validator.Required.validate(value));
  }, 300)

  onSubmitForm = values => this.props.onSubmit({
    apartments: [values.apartment],
    building: values.building,
    email: {
      address: toString(values.email),
      verified: false,
    },
    phone: {
      number: toString(values.phone),
      verified: false,
    },
    username: values.usageUsernameAsPhoneNumber ? values.phone : values.username,
    profile: {
      firstName: values.firstName,
      lastName: values.lastName,
      gender: values.gender,
      dob: Validator.Date.withMoment(values.dob).toISOString(),
      address: values.address,
    },
    password: {
      value: values.password,
    },
  })
  .then(() => {
    this.onHide();
    this.onResetForm();
  })
  .catch(() => {
    throw new SubmissionError({
      _error: 'Có lỗi xảy ra trong quá trình thực hiện hành động này.',
    });
  })

  onResetForm = () => {
    const { dispatch, reset, form } = this.props;
    dispatch(reset(form));
  }

  render() {
    const { form, handleSubmit, submitting, pristine, invalid, apartment, currentValues, error } = this.props;

    return (
      <Modal show={this.state.showModal} onHide={this.onHide} backdrop="static" keyboard={false}>
        <Modal.Header closeButton={!submitting}>
          <Modal.Title>Tạo mới cư dân cho căn hộ {apartment.apartmentName}</Modal.Title>
        </Modal.Header>
        <form name={form} noValidate onSubmit={handleSubmit(this.onSubmitForm)}>
          <Modal.Body>
            {error && <Alert bsStyle={error ? 'danger' : 'success'}>{error}</Alert>}

            <Row>
              <Col xs={6}>
                <FormGroup controlId="firstName">
                  <ControlLabel>Họ (*)</ControlLabel>
                  <Field
                    type="text"
                    name="firstName"
                    component={ReduxFormFields.InputField}
                    validate={[
                      Validator.AlphaSpaces(null, 'Giá trị chỉ có thể chứa chữ cái và khoảng cách'),
                    ]}
                  />
                </FormGroup>
              </Col>
              <Col xs={6}>
                <FormGroup controlId="lastName">
                  <ControlLabel>Tên (*)</ControlLabel>
                  <Field
                    type="text"
                    name="lastName"
                    component={ReduxFormFields.InputField}
                    validate={[
                      Validator.AlphaSpaces(null, 'Giá trị chỉ có thể chứa chữ cái và khoảng cách'),
                    ]}
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col xs={6}>
                <FormGroup controlId="gender">
                  <ControlLabel>Giới tính (*)</ControlLabel>
                  <Field
                    type="select"
                    name="gender"
                    component={ReduxFormFields.SelectField}
                    validate={[
                      Validator.Required(null, 'Bạn phải nhập dữ liệu'),
                    ]}
                    options={[
                      {
                        label: 'Vui lòng chọn ...',
                      },
                      {
                        value: 'male',
                        label: 'Nam',
                      },
                      {
                        value: 'female',
                        label: 'Nữ',
                      },
                    ]}
                  />
                </FormGroup>
              </Col>

              <Col xs={6}>
                <FormGroup controlId="dob">
                  <ControlLabel>Ngày sinh (*)</ControlLabel>
                  <Field
                    type="text"
                    name="dob"
                    component={ReduxFormFields.DateTimeField}
                    validate={[
                      Validator.Required(null, 'Bạn phải nhập dữ liệu'),
                    ]}
                    disableOnClickOutside
                    closeOnTab
                    closeOnSelect
                    inputProps={{
                      readOnly: true,
                    }}
                    timeFormat={false}
                    isValidDate={current => current.isBefore(Validator.Date.withMoment().endOf('year').subtract(16, 'years'))}
                    viewMode="years"
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col xs={6}>
                <FormGroup controlId="phone">
                  <ControlLabel>Số điện thoại (*)</ControlLabel>
                  <Field
                    type="text"
                    name="phone"
                    component={ReduxFormFields.InputField}
                    validate={[
                      Validator.Required(null, 'Bạn phải nhập dữ liệu'),
                      Validator.Int(null, 'Bạn phải nhập số'),
                      Validator.Min.Str(null, 'Số điện thoại ít nhất phải có 10 số', 10),
                    ]}
                    onChange={this.onGeneratePhoneToUsername}
                  />
                </FormGroup>
              </Col>

              <Col xs={6}>
                <FormGroup controlId="email">
                  <ControlLabel>Địa chỉ email (*)</ControlLabel>
                  <Field
                    type="email"
                    name="email"
                    component={ReduxFormFields.InputField}
                    validate={[
                      Validator.Required(null, 'Bạn phải nhập dữ liệu'),
                      Validator.Email(null, 'Email chưa đúng định dạng'),
                    ]}
                  />
                </FormGroup>
              </Col>
            </Row>

            <FormGroup controlId="username">
              <ControlLabel>Tên đăng nhập hệ thống (*)</ControlLabel>
              <Field
                type="text"
                name="username"
                component={ReduxFormFields.InputField}
                validate={[
                  Validator.Required.Unless(null, 'Bạn phải nhập dữ liệu', 'usageUsernameAsPhoneNumber'),
                ]}
                disabled={currentValues.usageUsernameAsPhoneNumber}
                addon={<Field
                  type="checkbox"
                  name="usageUsernameAsPhoneNumber"
                  component={ReduxFormFields.CheckboxField}
                  inline
                >Sử dụng số điện thoại</Field>}
              />
            </FormGroup>

            <FormGroup controlId="address">
              <ControlLabel>Địa chỉ (*)</ControlLabel>
              <Field
                type="textarea"
                name="address"
                component={ReduxFormFields.TextareaField}
                validate={[
                  Validator.Required(null, 'Bạn phải nhập dữ liệu'),
                ]}
              />
            </FormGroup>

            <HelpBlock bsClass="help-block text-warning">(*) Bắt buộc phải nhập dữ liệu</HelpBlock>

            <Clearfix />
          </Modal.Body>
          <Modal.Footer>
            <ButtonToolbar>
              <ButtonToolbar className="pull-right">
                <Button type="button" onClick={this.onResetForm} disabled={pristine || submitting}>Nhập lại</Button>
                <Button type="submit" bsStyle="primary" disabled={pristine || submitting || invalid}>Tạo mới</Button>
              </ButtonToolbar>
            </ButtonToolbar>
          </Modal.Footer>
        </form>

      </Modal>
    );
  }
}

AddNewResidentModal.propTypes = {
  initialValues: PropTypes.object.isRequired,
  currentValues: PropTypes.object.isRequired,
  onHide: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  form: PropTypes.string.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  apartment: PropTypes.object.isRequired,
  change: PropTypes.func.isRequired,
  onExistingUser: PropTypes.func.isRequired,
  error: PropTypes.string,
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
  'email',
  'phone',
  'usageUsernameAsPhoneNumber',
  'password',
];

const asyncValidate = (values, dispatch, ownerProps) => {
  const { username, email, phone } = values;
  const syncValidator = async () => {
    try {
      let result = {};
      if (Validator.Required.validate(username)) {
        const { data: { checkExistUser } } = await ownerProps.onExistingUser(username);
        if (checkExistUser) {
          result = { ...result, ...{ username: 'Tên đăng nhập đã tồn tại trên hệ thống' } };
        }
      }

      if (Validator.Required.validate(email)) {
        const { data: { checkExistUser } } = await ownerProps.onExistingUser(email);
        if (checkExistUser) {
          result = { ...result, ...{ email: 'Email đã tồn tại trên hệ thống' } };
        }
      }

      if (Validator.Required.validate(phone)) {
        const { data: { checkExistUser } } = await ownerProps.onExistingUser(phone);
        if (checkExistUser) {
          result = { ...result, ...{ phone: 'Số điện thoại đã tồn tại trên hệ thống' } };
        }
      }

      return result;
    } catch (error) {
      return new Error(error);
    }
  };

  return syncValidator().catch(() => ({ _error: 'Lỗi kết nối với máy chủ...' }));
};

const AddNewResidentForm = reduxForm({
  form: 'AddNewResidentForm',
  fields,
  touchOnChange: true,
  touchOnBlur: true,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  asyncValidate,
  asyncBlurFields: ['username', 'phone', 'email'],
})(AddNewResidentModal);

export default compose(
  connect(state => ({
    user: state.user,
    currentValues: formValueSelector('AddNewResidentForm')(state, ...fields),
  })),
)(AddNewResidentForm);
