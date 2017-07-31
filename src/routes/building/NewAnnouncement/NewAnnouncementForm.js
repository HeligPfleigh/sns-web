import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { ControlLabel, FormControl, FormGroup } from 'react-bootstrap';
import { Field, reduxForm } from 'redux-form';
import {
  required,
  minLength2,
} from '../../../utils/validator';
import {
  ANNOUNCEMENT_TYPE,
} from '../../../constants';
import s from './NewAnnouncementForm.scss';

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

class NewAnnouncementForm extends Component {

  render() {
    const {
      handleSubmit,
    } = this.props;
    return (
      <div>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <ControlLabel>Kiểu thông báo</ControlLabel>
            <br />
            <Field name="type" component="select">
              {
                ANNOUNCEMENT_TYPE.map(t =>
                  <option key={t} value={t}>{t}</option>,
                )
              }
            </Field>
          </FormGroup>
          <FormGroup>
            <ControlLabel>Tiêu đề</ControlLabel>
            <Field
              name="message"
              type="text"
              component={renderField}
              label="Message"
              validate={[required, minLength2]}
            />
          </FormGroup>
          <button type="submit">
            Cập nhật
          </button>
        </form>
      </div>
    );
  }
}

NewAnnouncementForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

const NewAnnouncementReduxForm = reduxForm({
  // a unique name for the form
  form: 'newAnnouncementForm',
})(NewAnnouncementForm);

export default withStyles(s)(NewAnnouncementReduxForm);
