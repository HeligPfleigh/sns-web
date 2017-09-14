import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  Button,
  Col,
  ControlLabel,
  FormGroup,
  Clearfix,
  ButtonToolbar,
 } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { compose } from 'react-apollo';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';

import Validator from '../../../components/Validator';
import * as ReduxFormFields from '../../../components/ReduxForm';
import s from './FAQ.scss';

class UpdateFAQModal extends Component {
  constructor(props, ...args) {
    super(props, ...args);

    this.state = {
      validationState: {},
      showModal: false,
    };

    this.onUpdate = this.onUpdate.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onHide = this.onHide.bind(this);
    this.resetForm = this.resetForm.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      showModal: Object.keys(nextProps.initialValues).length > 0,
    });
  }

  onUpdate({
      _id,
      name,
      message,
    }) {
    return this.props.onUpdate({
      _id,
      name,
      message,
      building: this.props.building._id,
    })
    .then(() => {
      this.resetForm();
      this.onHide();
    })
    .catch(() => {
      this.resetForm();
      this.props.onError('Có lỗi xảy ra trong quá trình sửa FAQ');
      this.onHide();
    });
  }

  onHide() {
    this.resetForm();
    this.props.onHide({});
  }

  onDelete(event) {
    event.preventDefault();
    const { _id, building } = this.props.initialValues;
    this.props.onDelete({
      _id,
      building: building._id,
    })
    .then(() => {
      this.resetForm();
      this.onHide();
    })
    .catch(() => {
      this.resetForm();
      this.props.onError('Có lỗi xảy ra trong quá trình xóa FAQ');
      this.onHide();
    });
  }

  resetForm = () => {
    const { dispatch, reset, form } = this.props;
    dispatch(reset(form));
  }

  render() {
    const {
      handleSubmit,
      pristine,
      submitting,
      invalid,
      form,
      canUpdate,
      canDelete,
    } = this.props;
    return (
      <Modal show={this.state.showModal} onHide={this.onHide} backdrop="static">
        <form name={form} noValidate onSubmit={handleSubmit(this.onUpdate)}>
          <Modal.Header closeButton={!submitting}>
            <Modal.Title>Sửa câu hỏi thường gặp</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Col className="form-horizontal" xs={12}>

              <FormGroup validationState={this.state.validationState.name}>
                <ControlLabel className="col-sm-3">Câu hỏi</ControlLabel>
                <Col sm={9}>
                  <Field
                    type="text"
                    name="name"
                    component={ReduxFormFields.InputField}
                    validate={[Validator.Required(null, 'Bạn phải nhập dữ liệu')]}
                  />
                </Col>
              </FormGroup>

              <FormGroup validationState={this.state.validationState.message}>
                <ControlLabel className="col-sm-3">Nội dung giải đáp</ControlLabel>
                <Col sm={9}>
                  <Field
                    type="textarea"
                    name="message"
                    component={ReduxFormFields.EditorField}
                    className={s.editor}
                    validate={[Validator.Required(null, 'Bạn phải nhập dữ liệu')]}
                  />
                </Col>
              </FormGroup>

            </Col>
            <Clearfix />
          </Modal.Body>
          <Modal.Footer>
            <ButtonToolbar>
              <Button onClick={this.onDelete} className="btn-danger" disabled={!canDelete || submitting}>Xóa</Button>
              <ButtonToolbar className="pull-right">
                <Button onClick={this.onHide} disabled={submitting}>Đóng cửa sổ</Button>
                <Button type="submit" bsStyle="primary" disabled={!canUpdate || pristine || submitting || invalid}>Sửa</Button>
              </ButtonToolbar>
            </ButtonToolbar>
          </Modal.Footer>
        </form>
      </Modal>
    );
  }
}

UpdateFAQModal.propTypes = {
  building: PropTypes.shape({
    _id: PropTypes.string,
    isAdmin: PropTypes.bool,
  }).isRequired,
  onHide: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  canUpdate: PropTypes.bool.isRequired,
  canDelete: PropTypes.bool.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  dispatch: PropTypes.any,
  reset: PropTypes.any,
  form: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.any.isRequired,
  submitting: PropTypes.bool.isRequired,
  invalid: PropTypes.any.isRequired,
};

UpdateFAQModal.defaultProps = {
  initialValues: {},
  canUpdate: false,
  canDelete: false,
  onHide: () => undefined,
};

const fields = [
  'name',
  'message',
];

const UpdateFAQForm = reduxForm({
  form: 'UpdateFAQ',
  fields,
  touchOnChange: true,
  touchOnBlur: true,
  enableReinitialize: true,
})(compose(
  withStyles(s),
)(UpdateFAQModal));

const mapStateToProps = state => ({
  currentValues: formValueSelector('UpdateFAQ')(state, ...fields),
});

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(UpdateFAQForm);
