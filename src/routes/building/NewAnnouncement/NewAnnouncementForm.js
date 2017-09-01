import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { FormControl, FormGroup } from 'react-bootstrap';
import { Field, reduxForm } from 'redux-form';
import {
  required,
  minLength2,
} from '../../../utils/validator';
import s from './NewAnnouncementForm.scss';

const renderTextField = ({ input, placeholder, type, meta: { touched, error, warning } }) => (
  <div>
    <FormControl
      {...input}
      placeholder={placeholder}
      type={type}
    />
    {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
  </div>
);

renderTextField.propTypes = {
  placeholder: PropTypes.string,
  input: PropTypes.any,
  type: PropTypes.string,
  meta: PropTypes.object,
};

const renderTextAreaField = ({ input, placeholder, componentClass, meta: { touched, error, warning } }) => (
  <div>
    <FormControl
      {...input}
      placeholder={placeholder}
      componentClass={componentClass}
      style={{ minHeight: '200px' }}
    />
    {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
  </div>
);

renderTextAreaField.propTypes = {
  placeholder: PropTypes.string,
  input: PropTypes.any,
  componentClass: PropTypes.string,
  meta: PropTypes.object,
};

class NewAnnouncementForm extends Component {

  render() {
    const {
      handleSubmit,
      submitting,
      reset,
    } = this.props;
    return (
      <div>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <div >
              <label>Tiêu đề</label>
            </div>
            <Field
              name="message"
              type="text"
              component={renderTextField}
              placeholder="Tiêu đề"
              validate={[required, minLength2]}
            />
          </FormGroup>
          <FormGroup>
            <div>
              <label>Nội dung</label>
            </div>
            <Field
              name="description"
              componentClass="textarea"
              component={renderTextAreaField}
              placeholder="Nội dung"
              validate={[required, minLength2]}
            />
          </FormGroup>
          <div>
            <div>
              <div className="pull-right">
                <button type="button" onClick={reset} className="btn btn-default" style={{ marginRight: '5px' }}>
                  Hủy
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary" >
                  Gửi
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

NewAnnouncementForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  reset: PropTypes.func.isRequired,
};

const NewAnnouncementReduxForm = reduxForm({
  // a unique name for the form
  form: 'newAnnouncementForm',
})(NewAnnouncementForm);

export default withStyles(s)(NewAnnouncementReduxForm);
