import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose, graphql } from 'react-apollo';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import classNames from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Grid, Row, Col, Form, ControlLabel, Button } from 'react-bootstrap';

import {
  isEmail,
  required,
  maxLength25,
  isMobilePhone,
} from '../../../../../../utils/validator';
import history from '../../../../../../core/history';
import Loading from '../../../../../../components/Loading';
import * as ReduxFormFields from '../../../../../../components/ReduxForm';
import UserDetailQuery from '../../graphql/UserDetailQuery.graphql';
import CheckExistUserQuery from '../../graphql/CheckExistUserQuery.graphql';
import UpdateProfileMutation from '../../graphql/UpdateProfileMutation.graphql';
import s from './styles.scss';

const defaultVal = 'chưa có thông tin.';
const genderSource = [
  { label: 'Nam', value: 'male' },
  { label: 'Nữ', value: 'female' },
  { label: 'Khác', value: 'other' },
];

const minDate = moment().subtract(120, 'years');
const maxDate = moment().subtract(16, 'years');

@withStyles(s)
class UserInfo extends Component {

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

  genderLabel = (gender) => {
    switch (gender) {
      case 'male':
        return 'Nam';
      case 'female':
        return 'Nữ';
      default:
        return 'Khác';
    }
  };

  updateView = (evt) => {
    if (evt) evt.preventDefault();

    const { timeout } = this.state;
    if (timeout) clearTimeout(timeout);

    this.setState({
      saved: false,
      timeout: null,
    });

    this.props.reset();
    this.props.refetch();
    history.goBack();
  }

  submit = (values) => {
    const { invalid, updateUserProfile } = this.props;
    if (!invalid) {
      const {
        userId,
        firstName,
        lastName,
        dob,
        gender,
        address,
        email,
        phone,
      } = values;

      let dobVal = dob;
      if (dobVal && !moment.isMoment(dobVal)) {
        dobVal = moment(dobVal);
      }

      const data = {
        userId,
        userData: {
          email: { address: email },
          phone: { number: phone },
          profile: {
            firstName,
            lastName,
            gender: gender || 'male',
            dob: dobVal && dobVal.isBefore(maxDate) ? dobVal.toDate() : maxDate.toDate(),
            address,
          },
        },
      };

      return updateUserProfile({
        variables: { input: data },
      }).then(() => {
        this.setState({ saved: true });
        this.props.refetch();
        this.clearAlert();
      }).catch(({ graphQLErrors }) => {
        this.setState({ saved: false });
        let message = 'Lỗi kết nối!';
        if (graphQLErrors) {
          message = graphQLErrors.shift().message;
        }
        throw new SubmissionError({
          _error: message,
        });
      });
    }
  }

  clearAlert = () => {
    const timeout = setTimeout(() => {
      this.setState({ saved: false });
    }, 5000);

    this.setState({ timeout });
  }

  isValidDate = current => current.isAfter(minDate) && current.isBefore(maxDate);

  render() {
    const {
      error,
      loading,
      isUpdateInfo,
      initialValues,
      submitting,
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

    const lineInfo = {
      marginTop: isUpdateInfo ? '0px' : '3px',
    };

    if (loading) {
      return (<Loading show={loading} full>Đang tải ...</Loading>);
    }

    return (
      <Form onSubmit={handleSubmit(this.submit)} autoComplete="off">
        { submitting && <Loading show={submitting} className={s.loading}>Đang tải ...</Loading> }
        {
          error && <div style={alertStyles}>
            <i className="fa fa-exclamation-circle" /> &nbsp;{error}
          </div>
        }
        {
          saved && <div style={alertStyles}>
            <i className="fa fa-exclamation-circle" /> &nbsp; Đổi thông tin thành công..!
          </div>
        }
        { isEmpty(initialValues) && <h4>Không tìm thấy thông tin</h4> }
        <Grid className={s.profile}>
          <Row className={classNames(s.profileInfo)}>
            <Col sm={2}>
              <i className="fa fa-user-circle-o fa-2x" aria-hidden="true"></i>
              <ControlLabel htmlFor="lastName">
                { isUpdateInfo ? 'Họ' : 'Họ và Tên' }
              </ControlLabel>
            </Col>
            <Col sm={7} className={classNames(s.profileRight)} style={lineInfo}>
              {isUpdateInfo ? <Field
                type="text"
                name="lastName"
                placeholder="Họ của bạn?"
                component={ReduxFormFields.InputField}
                validate={[required, maxLength25]}
              /> : `${initialValues.firstName} ${initialValues.lastName}`}
            </Col>
          </Row>
          { isUpdateInfo &&
            <Row className={classNames(s.profileInfo)}>
              <Col sm={2}>
                <i className="fa fa-2x" aria-hidden="true"></i>
                <ControlLabel htmlFor="firstName">Tên</ControlLabel>
              </Col>
              <Col sm={7} className={classNames(s.profileRight)} style={lineInfo}>
                <Field
                  type="text"
                  name="firstName"
                  placeholder="Tên của bạn?"
                  component={ReduxFormFields.InputField}
                  validate={[required, maxLength25]}
                />
              </Col>
            </Row>
          }
          <Row className={classNames(s.profileInfo)}>
            <Col sm={2}>
              <i className="fa fa-venus-mars fa-2x" aria-hidden="true"></i>
              <ControlLabel htmlFor="gender">Giới Tính</ControlLabel>
            </Col>
            <Col sm={7} className={classNames(s.profileRight)} style={lineInfo}>
              {isUpdateInfo &&
              <Field
                name="gender"
                options={genderSource}
                component={ReduxFormFields.SelectField}
              />}
              { !isUpdateInfo && this.genderLabel(initialValues.gender) }
            </Col>
          </Row>
          <Row className={classNames(s.profileInfo)}>
            <Col sm={2}>
              <i className="fa fa-birthday-cake fa-2x" aria-hidden="true"></i>
              <ControlLabel htmlFor="lastName">Ngày sinh</ControlLabel>
            </Col>
            <Col sm={7} className={classNames(s.profileRight)} style={lineInfo}>
              {isUpdateInfo ? <Field
                name="dob"
                locale="vi"
                inputProps={{
                  readOnly: true,
                }}
                timeFormat={false}
                closeOnTab
                closeOnSelect
                disableOnClickOutside
                defaultValue={initialValues.dob}
                dateFormat="DD-MM-YYYY"
                isValidDate={this.isValidDate}
                component={ReduxFormFields.DateTimeField}
              /> : moment(initialValues.dob).format('DD-MM-YYYY')}
            </Col>
          </Row>
          <Row className={classNames(s.profileInfo)}>
            <Col sm={2}>
              <i className="fa fa-phone-square fa-2x" aria-hidden="true"></i>
              <ControlLabel htmlFor="phone">Số điện thoại</ControlLabel>
            </Col>
            <Col sm={7} className={classNames(s.profileRight)} style={lineInfo}>
              {isUpdateInfo ? <Field
                type="text"
                name="phone"
                placeholder="Số điện thoại của bạn?"
                component={ReduxFormFields.InputField}
                validate={[required, isMobilePhone]}
              /> : initialValues.phone}
            </Col>
          </Row>
          <Row className={classNames(s.profileInfo)}>
            <Col sm={2}>
              <i className="fa fa-envelope fa-2x" aria-hidden="true"></i>
              <ControlLabel htmlFor="email">Email</ControlLabel>
            </Col>
            <Col sm={7} className={classNames(s.profileRight)} style={lineInfo}>
              {isUpdateInfo ? <Field
                type="text"
                name="email"
                placeholder="Email của bạn?"
                component={ReduxFormFields.InputField}
                validate={[required, isEmail]}
              /> : initialValues.email}
            </Col>
          </Row>
          <Row className={classNames(s.profileInfo)}>
            <Col sm={2}>
              <i className="fa fa-location-arrow fa-2x" aria-hidden="true"></i>
              <ControlLabel htmlFor="address">Địa chỉ</ControlLabel>
            </Col>
            <Col sm={7} className={classNames(s.profileRight)} style={lineInfo}>
              {isUpdateInfo ? <Field
                name="address"
                placeholder="Địa chỉ của bạn?"
                componentClass="textarea"
                component={ReduxFormFields.InputField}
              /> : initialValues.address}
            </Col>
          </Row>
          <Row>
            {
              isUpdateInfo &&
              <Col smOffset={3} sm={7} className="pull-right">
                <Button className={s.buttonCancel} onClick={this.updateView}>Hủy</Button>
                <Button type="submit" className={s.buttonAccept} disabled={submitting}>
                  Cập nhật
                </Button>
              </Col>
            }
          </Row>
        </Grid>
      </Form>
    );
  }
}

UserInfo.propTypes = {
  error: PropTypes.any,
  loading: PropTypes.any,
  refetch: PropTypes.func,
  initialValues: PropTypes.any,
  handleSubmit: PropTypes.func.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  isUpdateInfo: PropTypes.bool.isRequired,
  reset: PropTypes.func.isRequired,
  updateUserProfile: PropTypes.func,
};

const asyncValidate = (values, dispatch, ownerProps) => {
  const { userId, email, phone } = values;
  const { isExistUser } = ownerProps;
  const syncValidator = async () => {
    try {
      let result = {};
      if (!isEmpty(email) && await isExistUser({ query: email, userId })) {
        result = { ...result, ...{ email: 'Email đã được sử dụng bởi một người khác' } };
      }

      if (!isEmpty(phone) && await isExistUser({ query: phone, userId })) {
        result = { ...result, ...{ phone: 'Số điện thoại đã được sử dụng bởi một người khác' } };
      }
      return result;
    } catch (error) {
      return new Error(error);
    }
  };
  return syncValidator().catch(() => ({ _error: 'Lỗi kết nối với máy chủ...' }));
};

const ProfileReduxForm = reduxForm({
  // a unique name for the form
  form: 'updateProfileForm',
  touchOnBlur: true,
  touchOnChange: true,
  enableReinitialize: true,
  shouldValidate: ({ props }) => {
    if (props.error) {
      return false;
    }
    return true;
  },
  asyncValidate,
  asyncBlurFields: ['phone', 'email'],
})(UserInfo);

export default compose(
  graphql(UserDetailQuery, {
    options: props => ({
      variables: {
        requestId: props.requestId,
      },
    }),
    props: ({ data }) => {
      // initValues form
      const { requestsToJoinBuilding } = data;
      let initialValues = {};

      if (requestsToJoinBuilding) {
        const {
          _id,
          profile,
          phone,
          email: emailVal,
        } = requestsToJoinBuilding.user;

        initialValues = {
          userId: _id,
          firstName: (profile && profile.firstName) || defaultVal,
          lastName: (profile && profile.lastName) || defaultVal,
          dob: (profile && profile.dob) || maxDate,
          gender: (profile && profile.gender) || 'female',
          address: (profile && profile.address) || defaultVal,
          email: (emailVal && emailVal.address) || defaultVal,
          phone: (phone && phone.number) || defaultVal,
        };
      }

      const isExistUser = async (variables) => {
        try {
          const {
            data: { checkExistUser },
          } = await data.fetchMore({
            query: CheckExistUserQuery,
            variables,
            updateQuery: () => undefined,
          });

          return checkExistUser || false;
        } catch (e) {
          return false;
        }
      };

      return {
        isExistUser,
        initialValues,
        loading: data.loading,
        refetch: data.refetch,
      };
    },
  }),
  graphql(UpdateProfileMutation, { name: 'updateUserProfile' }),
)(ProfileReduxForm);
