import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Grid, Row, ControlLabel, FormControl, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { loadProfile } from '../../../reducers/me';

import {
  required,
  hasWhiteSpace,
  maxLength15,
  minLength2,
} from '../../../utils/validator';
import s from './ProfileReduxForm.scss';

const renderField = ({ input, label, type, meta: { touched, error, warning } }) => (
  <div>
    <FormControl
      {...input}
      placeholder={label}
      type={type}
    />
    {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
  </div>
);

renderField.propTypes = {
  label: PropTypes.string,
  input: PropTypes.any,
  type: PropTypes.string,
  meta: PropTypes.object,
};

class ProfileForm extends Component {

  componentDidMount() {
    this.props.load({
      firstName: this.props.firstName,
      lastName: this.props.lastName,
      gender: this.props.gender,
    });
  }

  render() {
    const {
      handleSubmit,
      submitting,
      isInfoUpdate,
      firstName,
      lastName,
      gender,
      openInfoUpdate,
      closeInfoUpdate,
    } = this.props;
    return (
      <div>
        <form onSubmit={handleSubmit}>
          <Grid className={s.profile}>
            <Row className={s.profileInfo}>
              <Col sm={3}>
                <i className="fa fa-address-book-o fa-2x" aria-hidden="true"></i>
                <ControlLabel htmlFor="lastName">Họ</ControlLabel>
              </Col>
              <Col sm={9} className={s.profileRight}>
                {isInfoUpdate ? <Field
                  name="lastName"
                  type="text"
                  component={renderField}
                  label="Enter Text"
                  validate={[required, hasWhiteSpace, maxLength15, minLength2]}
                /> : lastName}
              </Col>
            </Row>
            <Row className={s.profileInfo}>
              <Col sm={3}>
                <i className="fa fa-envelope-o fa-2x" aria-hidden="true"></i>
                <ControlLabel htmlFor="firstName">Tên</ControlLabel>
              </Col>
              <Col sm={9} className={s.profileRight}>
                {isInfoUpdate ? <Field
                  name="firstName"
                  type="text"
                  component={renderField}
                  label="Enter Text"
                  validate={[required, hasWhiteSpace, maxLength15, minLength2]}
                /> : firstName}
              </Col>
            </Row>
            <Row className={s.profileInfo}>
              <Col sm={3}>
                <i className="fa fa-venus-mars fa-2x" aria-hidden="true"></i>
                <ControlLabel htmlFor="gender">Giới Tính</ControlLabel>
              </Col>
              <Col sm={9} className={s.profileRight}>
                {isInfoUpdate &&
                  <Field name="gender" component="select">
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                  </Field>}
                {!isInfoUpdate && (gender === 'male' ? 'Nam' : 'Nữ') }
              </Col>
            </Row>
            <Row>
              {isInfoUpdate &&
                <Col smOffset={3} sm={9}>
                  <button type="submit" className={s.buttonAccept} disabled={submitting}>
                    Cập nhật
                  </button>
                  <button
                    type="button"
                    className={s.buttonCancel}
                    onClick={closeInfoUpdate}
                  >Hủy</button>
                </Col>}
            </Row>
          </Grid>
        </form>
        <Grid style={{ padding: '0px' }}>
          <Row>
            <Col smOffset={2} sm={10}>
              {!isInfoUpdate &&
              <button
                className={s.buttonAccept}
                type="button"
                onClick={openInfoUpdate}
              >Thay đổi</button>}
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

ProfileForm.propTypes = {
  load: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  gender: PropTypes.string.isRequired,
  isInfoUpdate: PropTypes.bool.isRequired,
  openInfoUpdate: PropTypes.func.isRequired,
  closeInfoUpdate: PropTypes.func.isRequired,
};

const ProfileReduxForm = reduxForm({
  // a unique name for the form
  form: 'updateProfileForm',
})(ProfileForm);

export default connect(
  state => ({
    initialValues: state.me.profile,
  }),
  { load: loadProfile },
)(withStyles(s)(ProfileReduxForm));
