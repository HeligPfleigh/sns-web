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
  TYPE1,
  TYPE2,
} from '../../../constants';
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

const renderSelectField = ({ input, placeholder, options, type, meta: { touched, error, warning } }) => (
  <div>
    <FormControl
      componentClass="select"
      {...input}
      placeholder={placeholder}
      type={type}
    >
      {options && options.map(option => <option key={Math.random()} value={option.value}>{option.label}</option>)}
    </FormControl>
    {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
  </div>
);

renderSelectField.propTypes = {
  placeholder: PropTypes.string,
  input: PropTypes.any,
  type: PropTypes.string,
  meta: PropTypes.object,
  options: PropTypes.arrayOf(PropTypes.object),
};

class NewAnnouncementForm extends Component {

  render() {
    const {
      handleSubmit,
    } = this.props;
    const types = [
      {
        label: 'Loại #1',
        value: TYPE1,
      },
      {
        label: 'Loại #2',
        value: TYPE2,
      },
    ];
    return (
      <div>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <ControlLabel>Kiểu thông báo</ControlLabel>
            <Field
              name="type"
              type="select"
              component={renderSelectField}
              placeholder="Loại thông báo"
              options={types}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Tiêu đề</ControlLabel>
            <Field
              name="message"
              type="text"
              component={renderTextField}
              placeholder="Tiêu đề"
              validate={[required, minLength2]}
            />
          </FormGroup>
          <button type="submit" className="btn btn-primary">
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
