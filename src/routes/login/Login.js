/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { connect } from 'react-redux';

import history from '../../core/history';
import loginSuccess from '../../actions/user';
import s from './Login.scss';

@connect(null, { loginSuccess })
class Login extends React.Component {
  static propTypes = {
    loginSuccess: PropTypes.func.isRequired,
  };

  fbLoginAction = (evt) => {
    evt.preventDefault();
    const { FB } = window;
    if (FB) {
      FB.login((res) => {
        if (res.authResponse) {
          const { accessToken: access_token } = res.authResponse;
          fetch('/auth/facebook', {
            headers: new Headers({
              'Content-Type': 'application/json',
            }),
            credentials: 'same-origin',
            method: 'post',
            body: JSON.stringify({ access_token }),
          }).then((response) => {
            if (!response.ok) {
              throw Error(response.statusText);
            }
            return response.json();
          }).then((user) => {
            this.props.loginSuccess(user);
            history.push('/');
          }).catch((err) => {
            console.log(err); // eslint-disable-line
          });
        } else {
          alert('User cancelled login or did not fully authorize.');
        }
      });
    } else {
      alert('Please import FB sdk after call api');
    }
  }

  render() {
    return (
      <section className={`container ${s.login_form}`}>
        <section>
          <form>
            <img src="/logo2.png" alt="" className="img-responsive" />

            <div className="form-group">
              <input type="text" className="form-control" placeholder="Tên đăng nhập" required />
              <span className={`glyphicon glyphicon-user ${s.addon}`}></span>
            </div>

            <div className="form-group" style={{ marginBottom: 15 }}>
              <input type="password" className="form-control" placeholder="Mật khẩu" required />
              <span className={`glyphicon glyphicon-lock ${s.addon}`}></span>
            </div>

            <div className="form-group" style={{ textAlign: 'left', margin: 0 }}>
              <label className="checkbox-inline">
                <input className={s.input_normal} type="checkbox" value="true" /> Lưu tài khoản?
              </label>
            </div>

            <span className="btn btn-primary btn-block">Đăng nhập</span>
            <a href="#">Reset password</a> or <a href="#">create account</a>
          </form>
        </section>
        <div>
          <a
            href="#"
            onClick={this.fbLoginAction}
            className={`btn ${s.btn_link_login} ${s.btn_link_login_facebook}`}
          >
            <i className="fa fa-facebook"></i> Facebook
          </a>
          <a className={`btn ${s.btn_link_login} ${s.btn_link_login_twitter}`} href="#">
            <i className="fa fa-twitter"></i> Twitter
          </a>
          <a className={`btn ${s.btn_link_login} ${s.btn_link_login_google_plus}`} href="#">
            <i className="fa fa-google-plus"></i> Google Plus
          </a>
        </div>
      </section>
    );
  }
}

export default withStyles(s)(Login);
