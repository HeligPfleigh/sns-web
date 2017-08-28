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
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import history from '../../core/history';
import { remove } from '../../actions/user';
import s from './Waiting.scss';

@connect(null, {
  removeStateUser: remove,
})
class Waiting extends Component {

  toLogin = (evt) => {
    // eslint-disable-next-line
    evt && evt.preventDefault();
    this.props.removeStateUser();
    history.push('/login');
  }

  render() {
    return (
      <div style={{ marginTop: '15%', textAlign: 'center' }}>
        <h1 className="text-danger">{this.props.title}</h1>
        <h3 className="text-warning">Tài khoản đang chờ xác thực!</h3>
        { // eslint-disable-next-line
          <p className="text-success">"Hệ thống sẽ tự động gửi thông báo đến bạn khi quá trình xác thực thông tin."</p>
        }
        <br />
        <h2 className="text-info">Xin quý khách vui lòng quay lại sau. Cảm ơn!</h2>
        <a className="btn btn-info" onClick={this.toLogin}>Đăng nhập với tài khoản khác</a>
      </div>
    );
  }
}

Waiting.propTypes = {
  title: PropTypes.string,
  removeStateUser: PropTypes.func,
};

export default withStyles(s)(Waiting);
