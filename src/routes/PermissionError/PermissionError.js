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
import { Panel, Row, Col, Button } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import history from '../../core/history';
import s from './PermissionError.scss';

class Waiting extends Component {

  goHome = () => {
    history.push('/');
  }

  render() {
    const { title } = this.props;
    return (
      <div className={s.container}>
        <Panel
          bsStyle="danger"
          className={s.alert}
          header={
            <h2>{title}</h2>
          }
        >
          <Col md={12}>
            <Row className="text-center">
              <h3 className="text-danger">Tài khoản của bạn không có quyền truy cập!</h3>
              <h3 className="text-success">
                Vui lòng chọn
                <span className="text-danger"> [ Đến trang chủ ] </span>
                để tiếp tục sử dụng ứng dụng!
              </h3>
              <br />
              <Button bsStyle="info" onClick={this.goHome}>
                <i className="fa fa-home" aria-hidden="true"></i>&nbsp;
                Đến trang chủ
              </Button>
            </Row>
          </Col>
        </Panel>
      </div>
    );
  }
}

Waiting.propTypes = {
  title: PropTypes.string,
};

export default withStyles(s)(Waiting);
