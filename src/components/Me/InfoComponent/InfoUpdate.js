import React, { Component, PropTypes } from 'react';
import { Field, reduxForm, initialize } from 'redux-form';
import { FormGroup, Col, FormControl, Button, ControlLabel } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Info.scss';

const validate = (values) => {
  const errors = [];
  console.log('values:', values);
  return errors;
};

const renderField = ({ input, label, meta: { touched, error } }) => (
  <FormGroup>
    <Col sm={2}>
      <ControlLabel>{label}</ControlLabel>
    </Col>
    <Col sm={10}>
      <FormControl
        {...input}
        placeholder={label}
      />
      {touched && error && <span>{error}</span>}
    </Col>
  </FormGroup>
);


renderField.propTypes = {
  label: PropTypes.string,
  input: PropTypes.any,
  type: PropTypes.string,
  meta: PropTypes.object,
  value: PropTypes.string,
};


class InfoUpdate extends Component {
  componentDidMount() {
    this.props.initialize(this.props.profile);
  }
  render() {
    const { closeInfoUpdate, error, handleSubmit, submitting } = this.props;
    return (
      <form onSubmit={handleSubmit} className={s.profile}>
        <Field
          name="lastName"
          type="text"
          component={renderField}
          label="Họ"
        />
        <Field
          name="firstName"
          type="text"
          component={renderField}
          label="Tên"
        />
        <FormGroup>
          <Col sm={2}>
            <ControlLabel>Giới tính</ControlLabel>
          </Col>
          <Col sm={10}>
            <Field name="gender" component="select">
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
            </Field>
          </Col>
        </FormGroup>
        {error && <strong>{error}</strong>}
        <FormGroup>
          <Col smOffset={2} sm={10}>
            <Button type="submit" disabled={submitting}>
              Cập nhật
            </Button>
            <Button
              type="button"
              onClick={closeInfoUpdate}
            >Hủy</Button>
          </Col>

        </FormGroup>

      </form>
    );
  }
}

InfoUpdate.propTypes = {
  error: PropTypes.object,
  handleSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  profile: PropTypes.object,
  closeInfoUpdate: PropTypes.func,
  initialize: PropTypes.func,
};

export default reduxForm({
  form: 'userInfoForm',
  validate,
})(withStyles(s)(InfoUpdate));
