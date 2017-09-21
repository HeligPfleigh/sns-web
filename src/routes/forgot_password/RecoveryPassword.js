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
import isBoolean from 'lodash/isBoolean';
import classNames from 'classnames';
import { Circle } from 'better-react-spinkit';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector, SubmissionError } from 'redux-form';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Row, Button } from 'react-bootstrap';

import history from '../../core/history';
import createApolloClient from '../../core/createApolloClient';
import { required, normalLength, password, comparePassword } from '../../utils/validator';
import Modal from '../../components/Modal';
import s from './styles.scss';

// create instance apollo client connection
const apolloClient = createApolloClient();

const codePasswordValidator = async ({ username, code }) => {
  try {
    const { data: { codePasswordValidator: result } } = await apolloClient.query({
      query: gql`query codePasswordValidator($username: String!, $code: String!) {
        codePasswordValidator(username: $username, code: $code)
      }`,
      variables: {
        code,
        username,
      },
    });
    return result;
  } catch ({ graphQLErrors }) {
    return graphQLErrors.shift().message;
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

class RecoveryPassword extends Component {

  constructor(props) {
    super(props);
    this.state = {
      saved: false,
      showModal: false,
      message: false,
    };
  }

  componentDidMount = async () => {
    const { query } = this.props;
    if (!isEmpty(query) && !isEmpty(query.username) && !isEmpty(query.code)) {
      this.setState({
        message: await codePasswordValidator(query),
      });
    }
  }

  submit = (values) => {
    const { password: passwordVal } = values;
    const { query: { username } } = this.props;

    const changePasswordQuery = gql`mutation changePasswordQuery(
      $username: String!,
      $password: String!
    ) {
      changeUserPassword(username: $username, password: $password)
    }`;

    this.setState({
      showModal: true,
    });

    return apolloClient.mutate({
      mutation: changePasswordQuery,
      variables: {
        username,
        password: passwordVal,
      },
    }).then(({ data: { changeUserPassword } }) => {
      if (changeUserPassword) {
        this.props.reset();
        this.setState({ saved: true });
        return;
      }
      throw new Error();
    }).catch(() => {
      throw new SubmissionError({
        _error: 'Lỗi kết nối!',
      });
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

  goBack = (evt) => {
    if (evt) evt.preventDefault();
    history.push('/forgot-password');
  }

  closeModal = () => {
    this.setState({
      showModal: false,
    });
  }

  compareValue = (value) => {
    const { firstPassword } = this.props;
    return comparePassword(firstPassword, value);
  };

  render() {
    const { showModal, saved, message } = this.state;
    const { query, error, handleSubmit, submitting, pristine } = this.props;

    let modalContent = '';
    if (isEmpty(query.username) || isEmpty(query.code)) {
      modalContent = 'Truy cập của bạn bị chăn bởi hệ thống!';
    }

    if (!isBoolean(message)) {
      modalContent = message;
    }

    if (modalContent !== '') {
      return (<Modal
        title={
          <strong>
            <i className="fa fa-exclamation-triangle" aria-hidden="true"></i> Cảnh báo
          </strong>
        }
        show
        style={{ top: '20%' }}
        backdrop="static"
        buttons={
          <Button onClick={this.goBack}>Quên mật khẩu</Button>
        }
      >
        <div style={{ textAlign: 'center' }}>
          <i className="fa fa-ban fa-5x text-danger" aria-hidden="true"></i>
          <br />
          <strong className="text-warning">{modalContent}</strong><br />
          <strong>Liên hệ BQL để nhận được trợ giúp. Cảm ơn!</strong><br />
        </div>
      </Modal>);
    }

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
            <h2>Thiết lập mật khẩu mới</h2>
          </div>

          <Field
            type="password"
            name="firstPassword"
            className="form-control"
            component={renderField}
            placeholder="(*) Mật khẩu"
            addOn={<span className={classNames('fa fa-lock', s.addon)}></span>}
            validate={[required, normalLength, password]}
          />

          <Field
            type="password"
            name="password"
            className="form-control"
            component={renderField}
            placeholder="(*) Nhập lại mật khẩu"
            addOn={<span className={classNames('fa fa-lock', s.addon)}></span>}
            validate={[required, normalLength, password, this.compareValue]}
          />

          <Button
            block bsStyle="primary" type="submit"
            disabled={pristine || submitting}
          >
            <strong>Cập nhật</strong>
          </Button>
        </form>
        { showModal &&
          <Modal
            title={<strong>Thông báo</strong>}
            show={showModal}
            onHide={this.closeModal}
            style={{ top: '20%' }}
            backdrop="static"
            buttons={
              <span>
                { error && <Button bsStyle="danger" onClick={this.closeModal}>Đóng cửa sổ</Button> }
                { saved && <Button bsStyle="success" onClick={this.goLogin}>Đến trang Đăng nhập</Button> }
              </span>
            }
          >
            { !saved && !error && <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Circle size={100} color="#4183f1" />
              </div>
              <br />
              <strong>Thao tác đang được xử lý</strong><br />
            </div> }

            { !saved && error && <div style={{ textAlign: 'center' }}>
              <i className="fa fa-ban fa-5x text-danger" aria-hidden="true"></i>
              <br />
              <strong>Thao tác thiết lập mật khẩu thất bại!</strong><br />
              <strong>Vui lòng kiểm tra thông tin đăng kí và thực hiện lại</strong><br />
            </div> }

            { saved && <div style={{ textAlign: 'center' }}>
              <i className="fa fa-check-circle-o fa-5x text-success" aria-hidden="true"></i>
              <br />
              <strong>Yêu cầu đã được xử lý thành công...</strong><br />
            </div> }
          </Modal>
        }
      </Row>
    );
  }
}

RecoveryPassword.propTypes = {
  query: PropTypes.object,
  error: PropTypes.any,
  reset: PropTypes.func,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  handleSubmit: PropTypes.func,
  firstPassword: PropTypes.string,
};

const RegisterForm = reduxForm({
  form: 'recoveryPasswordForm',
  touchOnBlur: true,
  touchOnChange: true,
})(withStyles(s)(RecoveryPassword));

const selector = formValueSelector('recoveryPasswordForm');
export default connect(state => ({
  firstPassword: selector(state, 'firstPassword'),
}))(RegisterForm);
