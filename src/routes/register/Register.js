import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import moment from 'moment';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector, SubmissionError } from 'redux-form';
import { Circle } from 'better-react-spinkit';
import { Button } from 'react-bootstrap';

import history from '../../core/history';
import InputField from '../../components/FormFields/InputField';
import DateTimeField from '../../components/FormFields/DateTimeField';
import Modal from '../../components/Modal';
import fetchAPI from '../../utils/fetchAPI';
import {
  required,
  email,
  password,
  comparePassword,
  normalLength,
  phoneNumber,
  hasWhiteSpace,
  hasSpecialChart,
  chartFirstRequired,
} from '../../utils/validator';
import s from './Register.scss';

const minDate = moment().subtract(120, 'years');
const maxDate = moment().subtract(16, 'years');

const asyncValidate = (fields) => {
  const { username, email: emailVal, phoneNumber: phoneNumberVal } = fields;
  const fooBar = async () => {
    let result = {};
    const { status: checkUsername } = (username && await fetchAPI('/auth/check_user', { username })) || {};
    if (checkUsername) {
      result = { ...result, ...{ username: 'Tên đăng nhập đã tồn tại trên hệ thống...' } };
    }

    const { status: checkEmail } = (emailVal && await fetchAPI('/auth/check_user', { username: emailVal })) || {};
    if (checkEmail) {
      result = { ...result, ...{ email: 'Email đã tồn tại trên hệ thống...' } };
    }

    const { status: checkPhone } = (phoneNumberVal && await fetchAPI('/auth/check_user', { username: phoneNumberVal })) || {};
    if (checkPhone) {
      result = { ...result, ...{ phoneNumber: 'Số điện thoại đã tồn tại trên hệ thống...' } };
    }

    return result;
  };
  return fooBar().catch(() => ({ _error: 'Lỗi kết nối...' }));
};

class Register extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      saved: false,
    };
  }

  toLogin = () => {
    this.setState({
      showModal: false,
    });
    history.push('/login');
  }

  isValidDate = current => current.isAfter(minDate) && current.isBefore(maxDate);

  submit = (values) => {
    const { username, password: passwordVal, fullName, gender, dob, email: emailVal, phoneNumber: phoneVal, address } = values;

    const account = {
      username,
      password: passwordVal,
    };

    const firstName = fullName.trim().split(' ')[0];
    const lastName = (fullName.trim().substring(firstName.length || 0, fullName.trim().length)).trim();

    const data = {
      ...account,
      emails: {
        address: emailVal,
      },
      phone: {
        number: phoneVal,
        verified: false,
      },
      profile: {
        firstName,
        lastName,
        gender: gender || 'male',
        dob: dob && dob.isBefore(maxDate) ? dob.toDate() : maxDate.toDate(),
        address,
      },
    };

    this.setState({
      showModal: true,
    });

    return fetchAPI('/auth/register', data).then(({ _id }) => {
      if (_id) {
        this.props.reset();
        this.setState({ saved: true });
        return '';
      }
      throw new Error();
    }).catch(() => {
      this.setState({ saved: false });
      throw new SubmissionError({
        _error: 'Lỗi đăng kí tài khoản!',
      });
    });
  }

  compareValue = (value) => {
    const { firstPassword } = this.props;
    return comparePassword(firstPassword, value);
  };

  closeModal = () => {
    this.setState({
      showModal: false,
    });
  }

  render() {
    const { saved } = this.state;
    const { handleSubmit, pristine, reset, submitting, valid, error } = this.props;

    const titleStyles = {
      marginTop: '50px',
      marginBottom: '30px',
      color: 'white',
    };

    const alertStyles = {
      fontStyle: 'italic',
      color: 'white',
      fontSize: '1.1em',
      textAlign: 'center',
      marginBottom: '10px',
      padding: '6px',
      backgroundColor: saved ? '#2BB74B' : '#E53935',
    };

    return (
      <div>
        <Modal
          title={<strong>Tiến trình đăng kí</strong>}
          show={this.state.showModal}
          onHide={this.closeModal}
          style={{ top: '25%' }}
          backdrop="static"
          buttons={
            <span>
              { !saved && error && <Button className="btn btn-danger" onClick={this.closeModal}>Đóng cửa sổ</Button> }
              { saved && <Button className="btn btn-success" onClick={this.toLogin}>Đến trang Đăng nhập</Button> }
            </span>
          }
        >
          { !saved && <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Circle size={100} color="#4183f1" />
            </div>
            <br />
            <strong>Thao tác thêm mới đang được xử lý</strong><br />
          </div> }

          { saved && <div style={{ textAlign: 'center' }}>
            <i className="fa fa-check-circle-o fa-5x text-success" aria-hidden="true"></i>
            <br />
            <strong>Thao tác thêm mới thành công...</strong><br />
            <strong>Bạn vui lòng kiểm tra mail</strong><br />
            <strong>Và thực hiện kích hoạt tài khoản theo hướng dẫn</strong><br />
          </div> }
        </Modal>
        <section className={`container ${s.login_form}`}>
          <div className="text-center" style={titleStyles}>
            <h3>Đăng kí tài khoản</h3>
          </div>
          {
            error && <div style={alertStyles}>
              <i className="fa fa-exclamation-circle" /> &nbsp;{error}
            </div>
          }

          {
            saved && <div style={alertStyles}>
              <i className="fa fa-exclamation-circle" /> &nbsp; Đăng kí tài khoản thành công..!
            </div>
          }
          <form method="POST" className="form-horizontal" autoComplete="off" onSubmit={handleSubmit(this.submit)}>
            <Field
              name="username"
              type="text"
              component={InputField}
              label="Tên tài khoản"
              placeholder="Nhập tên tài khoản"
              validate={[required, hasWhiteSpace, chartFirstRequired, normalLength, hasSpecialChart]}
            />

            <Field
              name="firstPassword"
              component={InputField}
              label="Mật khẩu"
              type="password"
              placeholder="Nhập mật khẩu"
              validate={[required, normalLength, password]}
            />

            <Field
              name="password"
              component={InputField}
              label="Nhập lại MK"
              type="password"
              placeholder="Nhập lại mật khẩu"
              validate={[required, normalLength, password, this.compareValue]}
            />

            <hr />
            <Field
              name="fullName"
              component={InputField}
              label="Họ và tên"
              type="text"
              placeholder="Họ và tên"
              validate={[required, normalLength]}
            />

            <div className="form-group">
              <label htmlFor="gender" className="col-sm-3 control-label">Giới tính</label>
              <div className="col-sm-4">
                <Field id="gender" name="gender" component="select" className="form-control">
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </Field>
              </div>
            </div>

            <Field
              name="dob"
              component={DateTimeField}
              label="Ngày sinh"
              placeholder="Chọn ngày sinh"
              dateFormat="DD-MM-YYYY"
              defaultValue={maxDate}
              isValidDate={this.isValidDate}
            />

            <Field
              name="email"
              component={InputField}
              label="Địa chỉ mail"
              type="text"
              placeholder="Nhập địa chỉ email của bạn"
              validate={[required, normalLength, email]}
            />

            <Field
              name="phoneNumber"
              component={InputField}
              label="Số SĐT"
              type="number"
              placeholder="Nhập số điện thoại của bạn"
              validate={[required, normalLength, phoneNumber]}
            />

            <div className="form-group">
              <label htmlFor="address" className="col-sm-3 control-label">Địa chỉ</label>
              <div className="col-sm-9">
                <Field
                  id="address"
                  name="address"
                  component="textarea"
                  type="text"
                  placeholder="Ví dụ: Căn hộ 2106, Chung cư Skylight, số 205D, Minh Khai, HBT, HN"
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-group">
              <div className="col-sm-offset-3 col-sm-9">
                { pristine && <a className="btn-lg btn btn-danger" href="#" onClick={() => history.push('/login')}>Hủy đăng kí</a> }
                { !pristine && <button type="button" className="btn-lg btn btn-danger" disabled={pristine || submitting} onClick={reset}>
                  <i className="fa fa-refresh"></i> Nhập lại
                </button> }
                &nbsp;&nbsp;
                <button type="submit" className="btn-lg btn btn-primary" disabled={!valid || pristine || submitting}>
                  <i className="fa fa-paper-plane"></i> Đăng ký
                </button>
              </div>
            </div>
          </form>
        </section>
      </div>
    );
  }
}

Register.propTypes = {
  handleSubmit: PropTypes.func,
  reset: PropTypes.func,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  valid: PropTypes.bool,
  error: PropTypes.string,
  firstPassword: PropTypes.string,
};

const RegisterForm = reduxForm({
  form: 'registerForm',
  asyncValidate,
  asyncBlurFields: ['username', 'email', 'phoneNumber'],
})(withStyles(s)(Register));

const selector = formValueSelector('registerForm');
const RegisterPage = connect((state) => {
  const firstPassword = selector(state, 'firstPassword');
  return { firstPassword };
})(RegisterForm);

export default RegisterPage;
