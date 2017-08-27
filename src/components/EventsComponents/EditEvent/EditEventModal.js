import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  Button,
  Image,
  Col,
  ControlLabel,
  FormGroup,
  FormControl,
  Clearfix,
  HelpBlock,
  ButtonToolbar,
 } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { compose } from 'react-apollo';
import ReactDateTime from 'react-datetime';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import isArray from 'lodash/isArray';
import head from 'lodash/head';
import isUndefined from 'lodash/isUndefined';
import isFunction from 'lodash/isFunction';
import { connect } from 'react-redux';

import history from '../../../core/history';
import { Privacy } from '../../Dropdown';
import Validator from '../../Validator';
import { DraftEditor } from '../../Editor';
import { SingleUploadFile } from '../../ApolloUpload';
// import MakeFormSafe from './MakeFormSafe';
import s from './EditEvent.scss';

class ReduxFormInputField extends Component {
  render() {
    const { input, meta: { touched, error, warn }, ...props } = this.props;
    return (<div>
      <FormControl {...input} {...props} />
      {touched && (error || warn) && <HelpBlock>{error || warn}</HelpBlock>}
    </div>);
  }
}
ReduxFormInputField.propTypes = {
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
};

class ReduxFormDateTimeField extends Component {
  constructor(...args) {
    super(...args);

    this.onChange = this.onChange.bind(this);
    this.componentRef = this.componentRef.bind(this);
  }

  onChange(dateSelected) {
    const { input, closeOnSelect } = this.props;
    input.onChange(dateSelected);

    // Fix bug: When the attribute named closeOnSelect has defined, the datetime picker popup always hidden.
    if (closeOnSelect) {
      // this.datetimeRef.closeCalendar();
    }
  }

  componentRef(datetimeRef) {
    this.datetimeRef = datetimeRef;
  }

  render() {
    const { input: { onChange, ...input }, meta: { touched, error, warn }, closeOnSelect, ...props } = this.props;
    return (<div>
      <ReactDateTime {...input} {...props} ref={this.componentRef} onChange={this.onChange} />
      {touched && (error || warn) && <HelpBlock>{error || warn}</HelpBlock>}
    </div>);
  }
}
ReduxFormDateTimeField.propTypes = {
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  closeOnSelect: PropTypes.bool,
};

class ReduxFormEditorField extends DraftEditor {
  render() {
    const { meta: { touched, error, warn } } = this.props;
    return (<div>
      {super.render()}
      {touched && (error || warn) && <HelpBlock>{error || warn}</HelpBlock>}
    </div>);
  }
}
ReduxFormEditorField.propTypes = {
  meta: PropTypes.object.isRequired,
};

class ReduxFormHiddenField extends Component {
  componentWillMount() {
    const { onFill, input } = this.props;
    if (isFunction(onFill)) {
      onFill(input.value);
    }
  }

  componentDidUpdate(prevProps) {
    const { onFill, input } = this.props;
    if (isFunction(onFill) && input.value !== prevProps.input.value) {
      onFill(input.value);
    }
  }

  render() {
    return null;
  }
}
ReduxFormHiddenField.propTypes = {
  input: PropTypes.object.isRequired,
  onFill: PropTypes.func,
};

class EditEventModal extends Component {
  constructor(props, ...args) {
    super(props, ...args);

    this.state = {
      photo: isArray(props.initialValues.photos) && head(props.initialValues.photos),
      privacy: props.initialValues.privacy,
      showEndTime: !isUndefined(props.initialValues.end),
    };

    this.onUploadSuccess = this.onUploadSuccess.bind(this);
    this.onUploadClick = this.onUploadClick.bind(this);
    this.showEndTime = this.showEndTime.bind(this);
    this.hideEndTime = this.hideEndTime.bind(this);
    this.onPrivacySelected = this.onPrivacySelected.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  onUploadSuccess({ uploadSingleFile }) {
    this.setState({
      photo: uploadSingleFile.file.url,
    });

    this.props.change('photos', [uploadSingleFile.file.url]);
  }

  onUploadClick() {
    this.uploadRef.click();
  }

  onPrivacySelected(privacy) {
    this.setState({
      privacy,
    });

    this.props.change('privacy', privacy);
  }

  onUpdate({
      _id,
      privacy,
      photos,
      name,
      location,
      start,
      end,
      message,
      invites,
    }) {
    return this.props.onUpdate(_id, {
      privacy,
      photos,
      name,
      location,
      start,
      end,
      message,
      invites,
    })
    .then(() => this.props.onHide())
    .catch(() => this.props.onHide());
  }

  onDelete() {
    this.props.onDelete(this.props.initialValues._id).then(() => {
      history.push('/events');
    });
  }

  showEndTime(event) {
    event.preventDefault();

    this.setState({
      showEndTime: true,
    });
  }

  hideEndTime(event) {
    event.preventDefault();

    this.setState({
      showEndTime: false,
    });
  }

  render() {
    const {
      handleSubmit,
      pristine,
      submitting,
      invalid,
      form,
      currentValues,
      initialValues,
      canUpdate,
      canDelete,
    } = this.props;
    return (
      <Modal show={this.props.show} onHide={this.props.onHide} backdrop="static">
        <form name={form} noValidate onSubmit={handleSubmit(this.onUpdate)}>
          <Modal.Header closeButton={!submitting}>
            <Modal.Title>Tạo sự kiện</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Col className="form-horizontal" xs={12}>

              <FormGroup>
                <ControlLabel className="col-sm-3">Ảnh sự kiện</ControlLabel>
                <Col sm={9}>
                  <div className={s.layoutForButtonUpload}>
                    <div className={s.buttonToolbar}>
                      <Button
                        onClick={this.onUploadClick}
                        className={s.btnUpload}
                      >
                        <i className="fa fa-camera" aria-hidden="true"></i>
                        <strong>  Đăng hình</strong>
                        <SingleUploadFile
                          inputRef={input => this.uploadRef = input}
                          onSuccess={this.onUploadSuccess}
                          className="hide"
                        />
                      </Button>
                    </div>
                    {this.state.photo ?
                      <div className={s.imgThumbnail}>
                        <Image
                          src={this.state.photo}
                          responsive
                          className={s.imgResponsive}
                        />
                        <Field
                          type="hidden"
                          name="photos"
                          component={ReduxFormHiddenField}
                        />
                      </div> : null}
                  </div>
                </Col>
              </FormGroup>

              <FormGroup>
                <ControlLabel className="col-sm-3">Tên sự kiện</ControlLabel>
                <Col sm={9}>
                  <Field
                    type="text"
                    name="name"
                    component={ReduxFormInputField}
                    validate={[Validator.Required(null, 'Bạn phải nhập dữ liệu')]}
                  />
                </Col>
              </FormGroup>

              <FormGroup>
                <ControlLabel className="col-sm-3">Vị trí</ControlLabel>
                <Col sm={9}>
                  <Field
                    type="text"
                    name="location"
                    component={ReduxFormInputField}
                    validate={[Validator.Required(null, 'Bạn phải nhập dữ liệu')]}
                  />
                </Col>
              </FormGroup>

              <FormGroup>
                <ControlLabel className="col-sm-3">{ this.state.showEndTime ? 'Bắt đầu' : 'Ngày / Giờ' }</ControlLabel>
                <Col sm={5}>
                  <Field
                    type="text"
                    name="start"
                    component={ReduxFormDateTimeField}
                    disableOnClickOutside
                    closeOnTab
                    closeOnSelect
                    inputProps={{
                      readOnly: true,
                    }}
                    validate={[Validator.Required(null, 'Bạn phải nhập dữ liệu')]}
                  />
                </Col>
                {!this.state.showEndTime && (
                <Col sm={4} className={s.showEndTime}>
                  <a onClick={this.showEndTime}>+ Thời gian kết thúc</a>
                </Col>
              )}
              </FormGroup>

              {this.state.showEndTime && (
              <FormGroup>
                <ControlLabel className="col-sm-3">Kết thúc</ControlLabel>
                <Col sm={5}>
                  <Field
                    type="text"
                    name="end"
                    component={ReduxFormDateTimeField}
                    disableOnClickOutside
                    closeOnTab
                    closeOnSelect
                    inputProps={{
                      readOnly: true,
                    }}
                    validate={[Validator.Required(null, 'Bạn phải nhập dữ liệu')]}
                  />
                </Col>
                <Col sm={4} className={s.showEndTime}>
                  <a onClick={this.hideEndTime}>Xóa</a>
                </Col>
              </FormGroup>
            )}

              <FormGroup>
                <ControlLabel className="col-sm-3">Miêu tả</ControlLabel>
                <Col sm={9}>
                  <Field
                    type="textarea"
                    name="message"
                    component={ReduxFormEditorField}
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
              <Button onClick={this.onDelete} className="btn-danger" disabled={!canDelete || submitting}>Hủy sự kiện</Button>
              <ButtonToolbar className="pull-right">
                <Privacy ref={privacy => this.privacyRef = privacy} className={s.btnPrivacies} onSelect={this.onPrivacySelected} value={this.state.privacy} />
                <Field
                  type="hidden"
                  name="privacy"
                  component={ReduxFormHiddenField}
                />
                <Button onClick={this.props.onHide} disabled={submitting}>Đóng cửa sổ</Button>
                <Button type="submit" bsStyle="primary" disabled={!canUpdate || pristine || submitting || invalid}>Sửa</Button>
              </ButtonToolbar>
            </ButtonToolbar>
          </Modal.Footer>
        </form>
      </Modal>
    );
  }
}

EditEventModal.propTypes = {
  onHide: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  initialValues: PropTypes.object.isRequired,
  canUpdate: PropTypes.bool.isRequired,
  canDelete: PropTypes.bool.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

EditEventModal.defaultProps = {
  show: false,
  canUpdate: false,
  canDelete: false,
  onHide: () => undefined,
};

const fields = [
  'name',
  'photos',
  'start',
  'end',
  'location',
  'message',
  'privacy',
];

const EditEventForm = reduxForm({
  form: 'EditEvent',
  fields,
  touchOnChange: true,
  touchOnBlur: true,
  enableReinitialize: true,
})(compose(
  withStyles(s),
)(EditEventModal));

const mapStateToProps = state => ({
  currentValues: formValueSelector('EditEvent')(state, ...fields),
});

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(EditEventForm);
