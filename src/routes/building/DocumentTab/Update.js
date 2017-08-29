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
import { SingleUploadFile } from '../../../components/ApolloUpload';
import * as ReduxFormFields from '../../../components/ReduxForm';
import s from './Document.scss';

class UpdateDocumentModal extends Component {
  constructor(props, ...args) {
    super(props, ...args);

    this.state = {
      validationState: {},
      showModal: false,
    };

    this.onUploadSuccess = this.onUploadSuccess.bind(this);
    this.onUploadClick = this.onUploadClick.bind(this);
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

  onUploadSuccess({ uploadSingleFile }) {
    this.setState({
      photo: uploadSingleFile.file.url,
    });

    this.props.change('file', uploadSingleFile.file.url);
  }

  onUploadClick() {
    this.uploadRef.click();
  }

  onUpdate({
      _id,
      name,
      file,
    }) {
    return this.props.onUpdate({
      _id,
      name,
      file,
      building: this.props.building._id,
    })
    .then(() => {
      this.resetForm();
      this.onHide();
    })
    .catch(() => {
      this.resetForm();
      this.props.onError('Có lỗi xảy ra trong quá trình sửa biểu mẫu');
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

  onDelete() {
    this.props.onDelete(this.props.initialValues._id);
  }

  render() {
    const {
      handleSubmit,
      pristine,
      submitting,
      invalid,
      form,
      currentValues,
      canUpdate,
      canDelete,
    } = this.props;
    return (
      <Modal show={this.state.showModal} onHide={this.onHide} backdrop="static">
        <form name={form} noValidate onSubmit={handleSubmit(this.onUpdate)}>
          <Modal.Header closeButton={!submitting}>
            <Modal.Title>Sửa biểu mẫu</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Col className="form-horizontal" xs={12}>

              <FormGroup validationState={this.state.validationState.name}>
                <ControlLabel className="col-sm-3">Tên biểu mẫu</ControlLabel>
                <Col sm={9}>
                  <Field
                    type="text"
                    name="name"
                    component={ReduxFormFields.InputField}
                    validate={[Validator.Required(null, 'Bạn phải nhập dữ liệu')]}
                  />
                </Col>
              </FormGroup>

              <FormGroup>
                <ControlLabel className="col-sm-3">Tài liệu đính kèm</ControlLabel>
                <Col sm={9}>
                  <Button
                    onClick={this.onUploadClick}
                    className={s.btnUpload}
                  >
                    <i className="fa fa-upload" aria-hidden="true"></i>
                    <strong> Tải lên</strong>
                    <SingleUploadFile
                      inputRef={input => this.uploadRef = input}
                      onSuccess={this.onUploadSuccess}
                      className="hide"
                      accept="application/msword,application/vnd.ms-excel,application/vnd.ms-powerpoint,text/plain, application/pdf,image/*,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    />
                  </Button>
                  <Field
                    type="text"
                    name="file"
                    component={currentValues.file ? ReduxFormFields.InputField : ReduxFormFields.HiddenField}
                    validate={[Validator.Required(null, 'Bạn phải tải tập tin lên')]}
                    disabled="disabled"
                    className={s.uploadFormControl}
                  />
                </Col>
              </FormGroup>

            </Col>
            <Clearfix />
          </Modal.Body>
          <Modal.Footer>
            <ButtonToolbar>
              <Button onClick={this.onDelete} className="btn-danger" disabled={!canDelete || submitting}>Xóa biểu mẫu</Button>
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

UpdateDocumentModal.propTypes = {
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
};

UpdateDocumentModal.defaultProps = {
  initialValues: {},
  canUpdate: false,
  canDelete: false,
  onHide: () => undefined,
};

const fields = [
  'name',
  'file',
];

const UpdateDocumentForm = reduxForm({
  form: 'UpdateDocument',
  fields,
  touchOnChange: true,
  touchOnBlur: true,
  enableReinitialize: true,
})(compose(
  withStyles(s),
)(UpdateDocumentModal));

const mapStateToProps = state => ({
  currentValues: formValueSelector('UpdateDocument')(state, ...fields),
});

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(UpdateDocumentForm);
