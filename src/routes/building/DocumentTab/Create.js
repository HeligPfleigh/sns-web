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
import classNames from 'classnames';

import Validator from '../../../components/Validator';
import { SingleUploadFile } from '../../../components/ApolloUpload';
import * as ReduxFormFields from '../../../components/ReduxForm';
import s from './Document.scss';

class CreateDocumentModal extends Component {
  constructor(props, ...args) {
    super(props, ...args);

    this.state = {
      validationState: {},
      showModal: props.show,
    };

    this.onUploadSuccess = this.onUploadSuccess.bind(this);
    this.onUploadClick = this.onUploadClick.bind(this);
    this.onCreate = this.onCreate.bind(this);
    this.onHide = this.onHide.bind(this);
    this.resetForm = this.resetForm.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      showModal: nextProps.show,
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

  onCreate({
      name,
      file,
    }) {
    const { building } = this.props;
    return this.props.onCreate({
      name,
      file,
      building: building._id,
    })
    .then(() => {
      this.resetForm();
      this.onHide();
    })
    .catch(() => {
      this.resetForm();
      this.props.onError('Có lỗi xảy ra trong quá trình tạo mới biểu mẫu');
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
            <Modal.Title>Tạo biểu mẫu</Modal.Title>
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
                    className={classNames('btn-upload', s.btnUpload)}
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

CreateDocumentModal.propTypes = {
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

CreateDocumentModal.defaultProps = {
  canCreate: false,
  onHide: () => undefined,
  onError: () => undefined,
};

const fields = [
  'name',
  'file',
];

const CreateDocumentForm = reduxForm({
  form: 'CreateDocument',
  fields,
  touchOnChange: true,
  touchOnBlur: true,
  enableReinitialize: true,
})(compose(
  withStyles(s),
)(CreateDocumentModal));

const mapStateToProps = state => ({
  currentValues: formValueSelector('CreateDocument')(state, ...fields),
});

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(CreateDocumentForm);
