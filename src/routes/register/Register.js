import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import moment from 'moment';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector, SubmissionError } from 'redux-form';
import { Circle } from 'better-react-spinkit';
import { Button } from 'react-bootstrap';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import debounce from 'lodash/debounce';
import gql from 'graphql-tag';

import createApolloClient from '../../core/createApolloClient';
import history from '../../core/history';
import { remove } from '../../actions/user';
import { InputField, DateTimeField, SelectField } from '../../components/FormFields';
import Modal from '../../components/Modal';
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
  objRequired,
} from '../../utils/validator';
import s from './Register.scss';

const apolloClient = createApolloClient();

const minDate = moment().subtract(120, 'years');
const maxDate = moment().subtract(16, 'years');

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

const asyncValidate = (fields) => {
  const { username, email: emailVal, phoneNumber: phoneNumberVal } = fields;
  const fooBar = async () => {
    try {
      let result = {};
      if (!isEmpty(username) && await checkExistUser(username)) {
        result = { ...result, ...{ username: 'Tên đăng nhập đã tồn tại trên hệ thống...' } };
      }

      if (!isEmpty(emailVal) && await checkExistUser(emailVal)) {
        result = { ...result, ...{ email: 'Email đã tồn tại trên hệ thống...' } };
      }

      if (!isEmpty(phoneNumberVal) && await checkExistUser(phoneNumberVal)) {
        result = { ...result, ...{ phoneNumber: 'Số điện thoại đã tồn tại trên hệ thống...' } };
      }

      return result;
    } catch (error) {
      return new Error(error);
    }
  };
  return fooBar().catch(() => ({ _error: 'Lỗi kết nối...' }));
};

class Register extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      saved: false,
      buildings: [],
    };
  }

  componentWillMount = () => {
    this.getDataSelect();
  }

  getDataSelect = debounce((input) => {
    const fooBar = async () => {
      try {
        const { data: { buildings } } = await apolloClient.query({
          query: gql`query searchBuildingQuery ($query: String) {
            buildings(query: $query) {
              _id
              display
              apartments {
                _id
                name
              }
            }
          }`,
          variables: {
            query: input || 'v',
          },
        });
        if (buildings) {
          return this.setState({
            buildings,
          });
        }
        return new Error();
      } catch (e) {
        return this.setState({
          buildings: [],
        });
      }
    };

    fooBar().catch(() => {
      this.setState({
        buildings: [],
      });
    });
  }, 300);

  reloadSource = (value) => {
    this.getDataSelect(value);
  }

  toLogin = (evt) => {
    // eslint-disable-next-line
    evt && evt.preventDefault();

    this.setState({
      showModal: false,
    });
    this.props.removeStateUser();
    history.push('/login');
  }

  isValidDate = current => current.isAfter(minDate) && current.isBefore(maxDate);

  submit = (values) => {
    const {
      username,
      password: passwordVal,
      building,
      apartments,
      fullName,
      gender,
      dob,
      email: emailVal,
      phoneNumber: phoneVal,
      address,
    } = values;

    const account = {
      username,
      password: passwordVal,
    };

    const firstName = fullName.trim().split(' ')[0];
    const lastName = (fullName.trim().substring(firstName.length || 0, fullName.trim().length)).trim();
    const { initialValues } = this.props;

    const data = {
      ...account,
      emails: {
        address: emailVal,
      },
      phone: {
        number: phoneVal,
      },
      profile: {
        firstName,
        lastName,
        gender: gender || 'male',
        dob: dob && dob.isBefore(maxDate) ? dob.toDate() : maxDate.toDate(),
        address,
        picture: (initialValues && initialValues.picture) || undefined,
      },
      services: (initialValues && initialValues.services && JSON.stringify(initialValues.services)) || undefined,
      building: building._id,
      apartments: map(apartments, '_id'),
    };

    const createUserQuery = gql`mutation createUserQuery($user: CreateUserInput!) {
      createUser(user: $user) {
        _id
      }
    }`;

    this.setState({
      showModal: true,
    });

    return apolloClient.mutate({
      mutation: createUserQuery,
      variables: {
        user: data,
      },
    }).then(({ data: { createUser } }) => {
      if (createUser && createUser._id) {
        this.props.reset();
        this.setState({ saved: true });
        return '';
      }
      throw new Error();
    }).catch(() => {
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

  handleChangeBuilding = () => {
    this.props.change('apartments', null);
  }

  render() {
    const { saved, buildings } = this.state;
    const { apartments, handleSubmit, pristine, reset, submitting, valid, error } = this.props;

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
          { !saved && !error && <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Circle size={100} color="#4183f1" />
            </div>
            <br />
            <strong>Thao tác thêm mới đang được xử lý</strong><br />
          </div> }

          { !saved && error && <div style={{ textAlign: 'center' }}>
            <i className="fa fa-ban fa-5x text-danger" aria-hidden="true"></i>
            <br />
            <strong>Thao tác tạo mới người dùng thất bại!</strong><br />
            <strong>Vui lòng kiểm tra thông tin đăng kí và thực hiện đăng kí lại</strong><br />
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
              placeholder="(*) Tên tài khoản"
              validate={[required, hasWhiteSpace, chartFirstRequired, normalLength, hasSpecialChart]}
            />

            <Field
              name="firstPassword"
              component={InputField}
              type="password"
              placeholder="(*) Mật khẩu"
              validate={[required, normalLength, password]}
            />

            <Field
              name="password"
              component={InputField}
              type="password"
              placeholder="(*) Nhập lại mật khẩu"
              validate={[required, normalLength, password, this.compareValue]}
            />

            <hr />
            <Field
              name="building"
              valueKey="_id"
              labelKey="display"
              component={SelectField}
              dataSource={buildings}
              placeholder="(*) Chọn tòa nhà bạn đang ở!"
              validate={[objRequired]}
              onChange={this.handleChangeBuilding}
              onInputChange={this.reloadSource}
            />

            <Field
              multi
              name="apartments"
              valueKey="_id"
              labelKey="name"
              component={SelectField}
              dataSource={apartments}
              placeholder="(*) Chọn căn hộ của bạn!"
              noResultsText="Tòa nhà bạn chọn chưa có thông tin về căn hộ..."
              validate={[objRequired]}
            />

            <Field
              name="fullName"
              component={InputField}
              type="text"
              placeholder="(*) Họ và tên"
              validate={[required, normalLength]}
            />

            <div className="form-group">
              <div className="col-sm-6">
                <Field
                  name="dob"
                  component={DateTimeField}
                  placeholder="(*) Chọn ngày sinh"
                  dateFormat="DD-MM-YYYY"
                  defaultValue={maxDate}
                  isValidDate={this.isValidDate}
                />
              </div>
              <div className="col-sm-6">
                <Field id="gender" name="gender" component="select" className="form-control">
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </Field>
              </div>
            </div>

            <Field
              name="email"
              component={InputField}
              type="text"
              placeholder="(*) Địa chỉ email của bạn"
              validate={[required, normalLength, email]}
            />

            <Field
              name="phoneNumber"
              component={InputField}
              type="text"
              placeholder="(*) Số điện thoại của bạn"
              validate={[required, phoneNumber]}
            />

            <div className="form-group">
              <div className="col-sm-12">
                <div className="pull-left text-danger" style={{ marginTop: '13px' }}>
                  <strong>(*) Trường bắt buộc</strong>
                </div>
                <div className="pull-right">
                  { pristine && <a className="btn-lg btn btn-danger" href="#" onClick={this.toLogin}>Hủy đăng kí</a> }
                  { !pristine && <button type="button" className="btn-lg btn btn-danger" disabled={pristine || submitting} onClick={reset}>
                    <i className="fa fa-refresh"></i> Nhập lại
                  </button> }
                  &nbsp;&nbsp;
                  <button type="submit" className="btn-lg btn btn-primary" disabled={!valid || pristine || submitting}>
                    <i className="fa fa-paper-plane"></i> Đăng ký
                  </button>
                </div>
              </div>
            </div>
          </form>
        </section>
      </div>
    );
  }
}

Register.propTypes = {
  change: PropTypes.func,
  handleSubmit: PropTypes.func,
  reset: PropTypes.func,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  valid: PropTypes.bool,
  error: PropTypes.string,
  firstPassword: PropTypes.string,
  apartments: PropTypes.any,
  removeStateUser: PropTypes.func,
  initialValues: PropTypes.any,
};

const RegisterForm = reduxForm({
  form: 'registerForm',
  touchOnBlur: true,
  touchOnChange: true,
  asyncValidate,
  asyncBlurFields: ['username', 'email', 'phoneNumber'],
})(withStyles(s)(Register));

const selector = formValueSelector('registerForm');
const RegisterPage = connect((state) => {
  const { user } = state;
  let initialValues = {};
  if (user) {
    const {
      username,
      profile: {
        firstName,
        lastName,
        gender,
        picture,
      },
      email: emailVal,
      phone,
      services,
    } = user;

    initialValues = {
      username: username || '',
      fullName: `${firstName} ${lastName}`,
      gender: gender || 'female',
      email: emailVal || '',
      phoneNumber: phone || '',
      picture,
      services,
    };
  }

  const firstPassword = selector(state, 'firstPassword');
  const building = selector(state, 'building');
  const apartments = (building && building.apartments) || [];
  return { initialValues, firstPassword, apartments };
}, {
  removeStateUser: remove,
})(RegisterForm);

export default RegisterPage;
