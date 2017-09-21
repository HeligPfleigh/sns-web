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
import gql from 'graphql-tag';
import isEmpty from 'lodash/isEmpty';
import classNames from 'classnames';
import { Circle } from 'better-react-spinkit';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Row, Button } from 'react-bootstrap';

import history from '../../core/history';
import createApolloClient from '../../core/createApolloClient';
import { required, email } from '../../utils/validator';
import Modal from '../../components/Modal';
import s from './styles.scss';

// create instance apollo client connection
const apolloClient = createApolloClient();

const checkExistUser = async (query = '') => {
  try {
    const { data: { checkExistUser: result } } = await apolloClient.query({
      query: gql`query checkExistUserQuery ($query: String) {
        checkExistUser(query: $query)
      }`,
      variables: {
        query,
      },
    });
    return result;
  } catch (error) {
    return false;
  }
};

const forgotPassword = async (emailVal) => {
  try {
    const { data: { forgotPassword: result } } = await apolloClient.query({
      query: gql`query forgotPassword($email: String!) {
        forgotPassword(email: $email)
      }`,
      variables: {
        email: emailVal,
      },
    });
    return result;
  } catch (error) {
    return false;
  }
};

const renderField = ({ className, input, placeholder, type, addOn, meta: { touched, error } }) => (
  <div className="form-group">
    <input {...input} className={className} placeholder={placeholder} type={type} />
    { addOn }
    {touched && error && <span style={{ color: 'white', fontSize: '1.1em' }}><i>* {error}</i></span>}
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

class ForgotPassword extends Component {

  constructor(props) {
    super(props);
    this.state = {
      saved: false,
      showModal: false,
    };
  }

  submit = (values) => {
    const { username } = values;
    const submitProccess = async () => {
      if (!isEmpty(username) && !await checkExistUser(username)) {
        throw Object({
          username: 'Địa chỉ mail không đã tồn tại',
        });
      }

      await this.setState({
        showModal: true,
      });

      const result = await forgotPassword(username);
      if (!result) {
        throw Object({
          _error: 'Unknow Error',
        });
      }

      this.props.reset();
      this.setState({ saved: true });
    };

    return submitProccess().catch((err) => {
      throw new SubmissionError(err);
    });
  }

  goLogin = (evt) => {
    if (evt) evt.preventDefault();

    this.setState(prevState => ({
      ...prevState,
      showModal: false,
    }), () => {
      history.push('/login');
    });
  }

  closeModal = () => {
    this.props.reset();
    this.setState({
      showModal: false,
    });
  }

  render() {
    const { showModal, saved } = this.state;
    const { error, handleSubmit, submitting, pristine } = this.props;
    return (
      <Row className={classNames(s.container)}>
        <form autoComplete="off" onSubmit={handleSubmit(this.submit)} method="POST">
          <img
            src="/logo2.png"
            alt="Đang load ảnh..."
            title="Về trang chủ"
            className="img-responsive"
            onClick={this.goLogin}
          />

          <div className={classNames(s.titlePage)}>
            <h2>Lấy lại mật khẩu</h2>
          </div>

          <Field
            type="text"
            name="username"
            placeholder="Địa chỉ email của bạn"
            className="form-control"
            component={renderField}
            addOn={<span className={classNames('fa fa-envelope', s.addon)}></span>}
            validate={[required, email]}
          />

          <Button
            block bsStyle="primary" type="submit"
            disabled={pristine || submitting}
          >
            <strong>Gửi thông tin</strong>
          </Button>
        </form>
        { showModal &&
          <Modal
            title={<strong>Xử lý yêu cầu</strong>}
            show={showModal}
            onHide={this.closeModal}
            style={{ top: '20%' }}
            backdrop="static"
            buttons={
              !error && <Button onClick={this.closeModal}>Đóng cửa sổ</Button>
            }
          >
            { !saved && !error && <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Circle size={100} color="#4183f1" />
              </div>
              <br />
              <strong>Yêu cầu của bạn đang được xử lý</strong><br />
            </div> }

            { !saved && error && <div style={{ textAlign: 'center' }}>
              <i className="fa fa-ban fa-5x text-danger" aria-hidden="true"></i>
              <br />
              <strong>Yêu cầu khôi phục mật khẩu thất bại!</strong><br />
              <strong>Vui lòng kiểm tra thông tin đăng kí và thực hiện lại</strong><br />
            </div> }

            { saved && <div style={{ textAlign: 'center' }}>
              <i className="fa fa-check-circle-o fa-5x text-success" aria-hidden="true"></i>
              <br />
              <strong>Yêu cầu đã được xử lý thành công...</strong><br />
              <strong>Bạn vui lòng kiểm tra mail</strong><br />
              <strong>Và thực hiện kích hoạt tài khoản theo hướng dẫn</strong><br />
            </div> }
          </Modal>
        }
      </Row>
    );
  }
}

ForgotPassword.propTypes = {
  error: PropTypes.any,
  reset: PropTypes.func,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  handleSubmit: PropTypes.func,
};

export default reduxForm({
  form: 'forgotPasswordForm',
  touchOnBlur: true,
  touchOnChange: true,
})(withStyles(s)(ForgotPassword));
