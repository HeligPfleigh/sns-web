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

class CreateFAQModal extends Component {
  constructor(props, ...args) {
    super(props, ...args);

    this.state = {
      validationState: {},
      showModal: props.show,
    };

    this.onCreate = this.onCreate.bind(this);
    this.onHide = this.onHide.bind(this);
    this.resetForm = this.resetForm.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      showModal: nextProps.show,
    });
  }

  onCreate({
      name,
      message,
    }) {
    const { building } = this.props;
    return this.props.onCreate({
      name,
      message,
      building: building._id,
    })
    .then(() => {
      this.resetForm();
      this.onHide();
    })
    .catch(() => {
      this.resetForm();
      this.props.onError('Có lỗi xảy ra trong quá trình tạo mới FAQ');
      this.onHide();
    });
  }

  resetForm() {
    const { dispatch, reset, form } = this.props;
    dispatch(reset(form));
  }

  onHide() {
    this.props.onHide({});
  }

  render() {
    const {
      handleSubmit,
      pristine,
      submitting,
      invalid,
      form,
      currentValues,
      canCreate,
    } = this.props;
    return (
      <Modal show={this.state.showModal} onHide={this.onHide} backdrop="static">
        <form name={form} noValidate onSubmit={handleSubmit(this.onCreate)}>
          <Modal.Header closeButton={!submitting}>
            <Modal.Title>Tạo FAQ</Modal.Title>
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
              <ButtonToolbar className="pull-right">
                <Button onClick={this.onHide} disabled={submitting}>Đóng cửa sổ</Button>
                <Button type="submit" bsStyle="primary" disabled={!canCreate || pristine || submitting || invalid}>Thêm mới</Button>
              </ButtonToolbar>
            </ButtonToolbar>
          </Modal.Footer>
        </form>
      </Modal>
    );
  }
}

CreateFAQModal.propTypes = {
  building: PropTypes.shape({
    _id: PropTypes.string,
    isAdmin: PropTypes.bool,
  }).isRequired,
  onHide: PropTypes.func.isRequired,
  canCreate: PropTypes.bool.isRequired,
  onCreate: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
};

CreateFAQModal.defaultProps = {
  canCreate: false,
  onHide: () => undefined,
  onError: () => undefined,
};

const fields = [
  'name',
  'message',
];

const CreateFAQForm = reduxForm({
  form: 'CreateFAQ',
  fields,
  touchOnChange: true,
  touchOnBlur: true,
  enableReinitialize: true,
})(compose(
  withStyles(s),
)(CreateFAQModal));

const mapStateToProps = state => ({
  currentValues: formValueSelector('CreateFAQ')(state, ...fields),
});

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(CreateFAQForm);
