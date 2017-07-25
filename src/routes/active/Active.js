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
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { Circle } from 'better-react-spinkit';
import { Button } from 'react-bootstrap';

import history from '../../core/history';
import InputField from '../../components/FormFields/InputField';
import Modal from '../../components/Modal';
import fetchAPI from '../../utils/fetchAPI';
import { required } from '../../utils/validator';
import s from './Active.scss';

class Activated extends React.Component {

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

  submit = (values) => {
    const { activeCode } = values;
    const { username } = this.props;

    const data = {
      username,
      activeCode,
    };

    this.setState({
      showModal: true,
    });

    return fetchAPI('/auth/active', data).then(({ _id }) => {
      if (_id) {
        this.props.reset();
        this.setState({ saved: true });
        return '';
      }
      throw new Error();
    }).catch(() => {
      this.setState({ saved: false });
      throw new SubmissionError({
        _error: 'Lỗi kích hoạt tài khoản!',
      });
    });
  }

  closeModal = () => {
    this.setState({
      showModal: false,
    });
  }

  render() {
    const { saved } = this.state;
    const { username, handleSubmit, pristine, reset, submitting, valid, error } = this.props;

    const titleStyles = {
      marginTop: '50px',
      marginBottom: '30px',
      color: 'white',
    };

    return (
      <div style={{ marginTop: '10%' }}>
        <Modal
          title={<strong>Tiến trình kích hoạt</strong>}
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
          { !saved && !error && <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Circle size={100} color="#4183f1" />
            </div>
            <br />
            <strong>Thao tác kích hoạt tài khoản đang được xử lý</strong><br />
          </div> }

          { saved && <div style={{ textAlign: 'center' }}>
            <i className="fa fa-check-circle-o fa-5x text-success" aria-hidden="true"></i>
            <br />
            <strong>Kích hoạt tài khoản thành công...</strong><br />
          </div> }

          { error && <div style={{ textAlign: 'center' }}>
            <i className="fa fa-times-circle-o fa-5x text-danger" aria-hidden="true"></i>
            <br />
            <strong>Lỗi kích hoạt</strong><br />
            <strong>Xin vui lòng thử lại sau!</strong><br />
          </div> }
        </Modal>
        { !username && <section className={`container ${s.login_form}`}>
          <div className="text-center" style={titleStyles}>
            <h2>Thông tin kích hoạt không tồn tại...</h2>
            <br />
            <a className="btn-lg btn btn-danger" href="#" onClick={() => history.push('/login')}>
              <i className="fa fa-home" aria-hidden="true"></i> Về trang chủ
            </a>
          </div>
        </section> }
        { username && <section className={`container ${s.login_form}`}>
          <div className="text-center" style={titleStyles}>
            <h2>Kích hoạt tài khoản</h2>
          </div>
          <form method="POST" className="form-horizontal" autoComplete="off" onSubmit={handleSubmit(this.submit)}>
            <Field
              name="activeCode"
              type="text"
              component={InputField}
              label="Mã kích hoạt"
              placeholder="Nhập mã kích hoạt"
              validate={[required]}
            />

            <div className="form-group">
              <div className="col-sm-offset-3 col-sm-9">
                { pristine && <a className="btn-lg btn btn-danger" href="#" onClick={() => history.push('/login')}>
                  <i className="fa fa-home" aria-hidden="true"></i> Trang chủ
                  </a>
                }
                { !pristine && <button type="button" className="btn-lg btn btn-danger" disabled={pristine || submitting} onClick={reset}>
                  <i className="fa fa-refresh"></i> Nhập lại
                </button> }
                &nbsp;&nbsp;
                <button type="submit" className="btn-lg btn btn-primary" disabled={!valid || pristine || submitting}>
                  <i className="fa fa-paper-plane"></i> Kích hoạt
                </button>
              </div>
            </div>
          </form>
        </section> }
      </div>
    );
  }
}

Activated.propTypes = {
  handleSubmit: PropTypes.func,
  reset: PropTypes.func,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  valid: PropTypes.bool,
  error: PropTypes.string,
  username: PropTypes.string,
};

export default reduxForm({
  form: 'activated',
})(withStyles(s)(Activated));
