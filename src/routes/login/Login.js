/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { connect } from 'react-redux';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import isEmpty from 'lodash/isEmpty';

import history from '../../core/history';
import { openAlertGlobal } from '../../reducers/alert';
import { required, normalLength } from '../../utils/validator';
import loginSuccess, { remove } from '../../actions/user';
import Alert from '../../components/Alert';
import s from './Login.scss';

const renderField = ({ className, input, placeholder, type, addOn, meta: { touched, error } }) => (
  <div className="form-group">
    <input {...input} className={className} placeholder={placeholder} type={type} />
    { addOn }
    {touched && error && <span style={{ color: 'white', fontSize: '1.1em' }}><i>*{error}</i></span>}
  </div>
);

renderField.propTypes = {
  className: PropTypes.any,
  input: PropTypes.any,
  addOn: PropTypes.node,
  placeholder: PropTypes.any,
  type: PropTypes.any,
  meta: PropTypes.any,
};

const fetchAPI = async (url, data) => {
  const response = await fetch(url, {
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
    credentials: 'same-origin',
    method: 'post',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw Error(response.statusText);
  }

  const user = await response.json();
  return user;
};

@connect(null, {
  loginSuccess,
  openAlertGlobal,
  removeStateUser: remove,
})
class Login extends Component {

  navigation = (user) => {
    const { removeStateUser } = this.props;

    if (isEmpty(user.buildings)) {
      if (user.id) {
        removeStateUser();
        history.push('/waiting?type=approval');
      } else {
        history.push('/register');
      }
    } else if (isEmpty(user.email)) {
      removeStateUser();
      // eslint-disable-next-line
      alert('Tài khoản không tồn tại');
      history.push('/login');
    } else if (user.email && !user.email.verified) {
      removeStateUser();
      history.push('/waiting?type=email');
    } else if (user.isActive === 0) {
      removeStateUser();
      history.push('/waiting?type=not-active');
    } else {
      history.push('/');
    }
  };

  loginAction = (values) => {
    const { username, password } = values;
    if (username.trim() === '') {
      throw new SubmissionError({
        username: 'Chưa nhập tên tài khoản',
      });
    } else if (password.trim() === '') {
      throw new SubmissionError({
        password: 'Chưa nhập mật khẩu',
      });
    } else {
      const loginProccess = async () => {
        try {
          const user = await fetchAPI('/auth/login', { username, password });
          this.props.loginSuccess(user);
          return this.navigation(user);
        } catch (error) {
          throw new Error(error);
        }
      };

      return loginProccess().catch(() => {
        throw new SubmissionError({
          _error: 'Thông tin đăng nhập không đúng',
        });
      });
    }
  }

  alertModal = message => this.props.openAlertGlobal({
    message,
    open: true,
    autoHideDuration: 0,
  })

  fbLoginAction = (evt) => {
    if (evt) evt.preventDefault();

    const { FB } = window;
    if (FB) {
      FB.login(async (res) => {
        if (res.authResponse) {
          const { accessToken: access_token } = res.authResponse;
          try {
            const user = await fetchAPI('/auth/facebook', { access_token });
            this.props.loginSuccess(user);
            return this.navigation(user);
          } catch (error) {
            this.alertModal('Đăng nhập thất bại.');
          }
        } else {
          this.alertModal('User cancelled login or did not fully authorize.');
        }
      });
    } else {
      this.alertModal('Please import FB sdk after call api');
    }
  }

  goForgotPasswordPage = (evt) => {
    if (evt) evt.preventDefault();
    history.push('/forgot-password');
  }

  render() {
    const { error, handleSubmit, submitting } = this.props;
    return (
      <section className={`container ${s.login_form}`}>
        <section>
          <form autoComplete="off" onSubmit={handleSubmit(this.loginAction)} method="POST">
            <img src="/logo2.png" alt="" className="img-responsive" />
            {error && <div style={{ backgroundColor: '#E53935', color: 'white', fontSize: '1.1em' }}><i>{error}</i></div>}

            <Field
              name="username"
              type="text"
              placeholder="Tên đăng nhập"
              className="form-control"
              component={renderField}
              addOn={<span className={`glyphicon glyphicon-user ${s.addon}`}></span>}
              validate={[required, normalLength]}
            />

            <Field
              name="password"
              type="password"
              placeholder="Mật khẩu"
              className="form-control"
              component={renderField}
              addOn={<span className={`glyphicon glyphicon-lock ${s.addon}`}></span>}
              validate={[required, normalLength]}
            />

            <div className="form-group" style={{ textAlign: 'left', marginBottom: 10 }}>
              <label className="checkbox-inline">
                <input className={s.input_normal} type="checkbox" value="true" /> Lưu tài khoản?
              </label>
            </div>
            <button className="btn btn-primary btn-block" disabled={submitting}>Đăng nhập</button>
          </form>
        </section>
        <div style={{ padding: '5px 35px 35px 35px' }}>
          <a className="pull-left" href="#" onClick={() => history.push('/register')}>
            <strong>Đăng kí</strong>
          </a>
          <a className="pull-right" href="#" onClick={this.goForgotPasswordPage}>
            Quên mật khẩu?
          </a>
        </div>
        <div className="clearfix" />
        <div className={s['btn-links']}>
          <a
            href="#"
            onClick={this.fbLoginAction}
            className={`btn ${s.btn_link_login} ${s.btn_link_login_facebook}`}
          >
            <i className="fa fa-facebook"></i> Facebook
          </a>
          { /*
              <a className={`btn ${s.btn_link_login} ${s.btn_link_login_twitter}`} href="#">
                <i className="fa fa-twitter"></i> Twitter
              </a>
              <a className={`btn ${s.btn_link_login} ${s.btn_link_login_google_plus}`} href="#">
                <i className="fa fa-google-plus"></i> Google Plus
              </a>
             */ }
        </div>
        <Alert />
      </section>
    );
  }
}

Login.propTypes = {
  error: PropTypes.any,
  submitting: PropTypes.bool,
  handleSubmit: PropTypes.func,
  removeStateUser: PropTypes.func,
  loginSuccess: PropTypes.func,
  openAlertGlobal: PropTypes.func,
};

export default reduxForm({
  form: 'loginForm',
  touchOnBlur: true,
  touchOnChange: true,
})(withStyles(s)(Login));
