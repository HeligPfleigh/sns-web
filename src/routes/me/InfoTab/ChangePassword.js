import React, { Component } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { Field, reduxForm, formValueSelector, SubmissionError } from 'redux-form';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {
  Col,
  Form,
  FormGroup,
  ControlLabel,
  Button,
  Clearfix,
} from 'react-bootstrap';

import {
  required,
  normalLength,
  checkPassword,
  comparePassword,
} from '../../../utils/validator';
import Loading from '../../../components/Loading';
import * as ReduxFormFields from '../../../components/ReduxForm';
import s from './InfoTab.scss';

@withStyles(s)
class ChangePassword extends Component {

  constructor(props) {
    super(props);
    this.state = {
      saved: false,
      timeout: null,
    };
  }

  onChange = () => {
    if (this.state.saved) {
      this.setState({ saved: false });
    }
  }

  compareValue = (value) => {
    const { newPassword } = this.props;
    return comparePassword(newPassword, value);
  };

  submit = (values) => {
    const { password: passwordVal, currentPassword } = values;
    const { username, changePassword } = this.props;

    return changePassword({
      username,
      password: passwordVal,
      oldPassword: currentPassword,
    }).then(({ data: { changeUserPassword } }) => {
      if (changeUserPassword) {
        this.props.reset();
        this.setState({ saved: true });
        this.clearAlert();
        return;
      }
      throw new Error();
    }).catch(({ graphQLErrors }) => {
      this.setState({ saved: false });

      if (graphQLErrors) {
        throw new SubmissionError({
          _error: graphQLErrors.shift().message,
        });
      }

      throw new SubmissionError({
        _error: 'Lỗi kết nối!',
      });
    });
  }

  clearAlert = () => {
    const timeout = setTimeout(() => {
      this.setState({ saved: false });
    }, 5000);

    this.setState({ timeout });
  }

  updateView = (evt) => {
    if (evt) evt.preventDefault();

    const { timeout } = this.state;
    if (timeout) clearTimeout(timeout);

    this.setState({ timeout: null });

    this.props.updateView();
  }

  render() {
    const {
      error,
      submitting,
      pristine,
      handleSubmit,
    } = this.props;

    const { saved } = this.state;

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
      <div className={s.container}>
        <Loading show={submitting} className={s.loading}>Đang tải ...</Loading>
        {
          error && <div style={alertStyles}>
            <i className="fa fa-exclamation-circle" /> &nbsp;{error}
          </div>
        }
        {
          saved && <div style={alertStyles}>
            <i className="fa fa-exclamation-circle" /> &nbsp; Đổi mật khẩu thành công..!
          </div>
        }
        <Form horizontal onSubmit={handleSubmit(this.submit)} onChange={this.onChange}>
          <FormGroup controlId="currentPassword">
            <Col componentClass={ControlLabel} sm={3}>
              Mật khẩu hiện tại
            </Col>
            <Col sm={8}>
              <Field
                type="password"
                name="currentPassword"
                placeholder="Mật khẩu hiện tại!"
                component={ReduxFormFields.InputField}
                validate={[required, normalLength, checkPassword]}
              />
            </Col>
            <Clearfix />
          </FormGroup>
          <FormGroup controlId="formHorizontalPassword">
            <Col componentClass={ControlLabel} sm={3}>
              Mật khẩu mới
            </Col>
            <Col sm={8}>
              <Field
                type="password"
                name="newPassword"
                placeholder="Mật khẩu mới!"
                component={ReduxFormFields.InputField}
                validate={[required, normalLength, checkPassword]}
              />
            </Col>
            <Clearfix />
          </FormGroup>
          <FormGroup controlId="newPassword">
            <Col componentClass={ControlLabel} sm={3}>
              Nhập lại mật khẩu mới
            </Col>
            <Col sm={8}>
              <Field
                type="password"
                name="password"
                placeholder="Nhập lại mật khẩu mới!"
                component={ReduxFormFields.InputField}
                validate={[required, normalLength, checkPassword, this.compareValue]}
              />
            </Col>
            <Clearfix />
          </FormGroup>
          <FormGroup>
            <Col smOffset={3} sm={9}>
              <Button type="submit" className={s.buttonAccept} disabled={pristine || submitting}>
                Cập nhật
              </Button>
              <Button className={s.buttonCancel} onClick={this.updateView}>Hủy</Button>
            </Col>
          </FormGroup>
        </Form>
        <Clearfix />
      </div>
    );
  }
}

ChangePassword.propTypes = {
  newPassword: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  updateView: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  changePassword: PropTypes.func.isRequired,
  error: PropTypes.any,
  reset: PropTypes.func.isRequired,
};

const selector = formValueSelector('changePasswordForm');
const ChangePasswordForm = reduxForm({
  // a unique name for the form
  form: 'changePasswordForm',
  touchOnBlur: true,
  touchOnChange: true,
})(ChangePassword);

const changePasswordQuery = gql`mutation changePasswordQuery(
  $username: String!,
  $password: String!,
  $oldPassword: String
) {
  changeUserPassword(username: $username, password: $password, oldPassword: $oldPassword)
}`;

export default compose(
  connect(state => ({
    username: state.user && state.user.username,
    newPassword: selector(state, 'newPassword'),
  })),
  graphql(changePasswordQuery, {
    props: ({ mutate }) => ({
      changePassword: variables => mutate({
        variables,
      }),
    }),
  }),
)(ChangePasswordForm);
