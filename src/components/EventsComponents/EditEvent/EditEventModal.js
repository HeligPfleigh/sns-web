import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  Button,
  Image,
  Col,
  ControlLabel,
  FormGroup,
  Clearfix,
  ButtonToolbar,
 } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { compose } from 'react-apollo';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import isArray from 'lodash/isArray';
import head from 'lodash/head';
import isUndefined from 'lodash/isUndefined';
import isFunction from 'lodash/isFunction';
import { connect } from 'react-redux';
import classNames from 'classnames';

import history from '../../../core/history';
import { Privacy } from '../../Dropdown';
import Validator from '../../Validator';
import { SingleUploadFile } from '../../ApolloUpload';
import * as ReduxFormFields from './FormFields';
import s from './EditEvent.scss';

class EditEventModal extends Component {
  constructor(props, ...args) {
    super(props, ...args);

    this.state = {
      photo: isArray(props.initialValues.photos) && head(props.initialValues.photos),
      privacy: props.initialValues.privacy,
      showEndTime: !isUndefined(props.initialValues.end),
      formFields: {},
      validationState: {},
    };

    this.onUploadSuccess = this.onUploadSuccess.bind(this);
    this.onUploadClick = this.onUploadClick.bind(this);
    this.showEndTime = this.showEndTime.bind(this);
    this.hideEndTime = this.hideEndTime.bind(this);
    this.onPrivacySelected = this.onPrivacySelected.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.validationState = this.validationState.bind(this);
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

  validationState(fieldName) {
    return () => null;
    // return () => {
    //   try {
    //     const fieldComponent = this.state.formFields[fieldName];
    //     if (isUndefined(fieldComponent)) {
    //       return false;
    //     }

    //     if (!isFunction(fieldComponent.getRenderedComponent)) {
    //       return false;
    //     }

    //     const { props } = fieldComponent.getRenderedComponent();
    //     return (props.meta.touched && ((props.meta.error && 'error') || (props.meta.warning && 'warning'))) || null;
    //   } catch (e) {
    //     return false;
    //   }
    // };
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
            <Modal.Title>Sửa sự kiện</Modal.Title>
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
                        className={classNames('btn-upload', s.btnUpload)}
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
                          type="input"
                          name="photos"
                          component={ReduxFormFields.HiddenField}
                        />
                      </div> : null}
                  </div>
                </Col>
              </FormGroup>

              <FormGroup validationState={this.state.validationState.name}>
                <ControlLabel className="col-sm-3">Tên sự kiện</ControlLabel>
                <Col sm={9}>
                  <Field
                    type="text"
                    name="name"
                    component={ReduxFormFields.InputField}
                    validate={[Validator.Required(null, 'Bạn phải nhập dữ liệu')]}
                    ref={input => this.state.formFields.name = input}
                    withRef
                    onChange={this.validationState('name')}
                  />
                </Col>
              </FormGroup>

              <FormGroup validationState={this.state.validationState.location}>
                <ControlLabel className="col-sm-3">Vị trí</ControlLabel>
                <Col sm={9}>
                  <Field
                    type="text"
                    name="location"
                    component={ReduxFormFields.InputField}
                    validate={[Validator.Required(null, 'Bạn phải nhập dữ liệu')]}
                    ref={input => this.state.formFields.location = input}
                    withRef
                    onChange={this.validationState('location')}
                  />
                </Col>
              </FormGroup>

              <FormGroup validationState={this.state.validationState.start}>
                <ControlLabel className="col-sm-3">{ this.state.showEndTime ? 'Bắt đầu' : 'Ngày / Giờ' }</ControlLabel>
                <Col sm={5}>
                  <Field
                    type="text"
                    name="start"
                    component={ReduxFormFields.DateTimeField}
                    disableOnClickOutside
                    closeOnTab
                    closeOnSelect
                    inputProps={{
                      readOnly: true,
                    }}
                    validate={[
                      Validator.Required(null, 'Bạn phải nhập dữ liệu'),
                      (value, values) => Validator.Date.isBefore(null, `Thời gian bắt đầu phải trước ${Validator.Date.withMoment(values.end).format('DD/MM/YYYY HH:mm')}`, values.end)(value),
                    ]}
                    ref={input => this.state.formFields.start = input}
                    withRef
                    onChange={this.validationState('start')}
                  />
                </Col>
                {!this.state.showEndTime && (
                <Col sm={4} className={s.showEndTime}>
                  <a onClick={this.showEndTime}>+ Thời gian kết thúc</a>
                </Col>
              )}
                <Clearfix />
              </FormGroup>

              {this.state.showEndTime && (
              <FormGroup validationState={this.state.validationState.end}>
                <ControlLabel className="col-sm-3">Kết thúc</ControlLabel>
                <Col sm={5}>
                  <Field
                    type="text"
                    name="end"
                    component={ReduxFormFields.DateTimeField}
                    disableOnClickOutside
                    closeOnTab
                    closeOnSelect
                    inputProps={{
                      readOnly: true,
                    }}
                    validate={[
                      Validator.Required(null, 'Bạn phải nhập dữ liệu'),
                      (value, values) => Validator.Date.isAfter(null, `Thời gian kết thúc phải sau ${Validator.Date.withMoment(values.start).format('DD/MM/YYYY HH:mm')}`, values.start)(value),
                    ]}
                    ref={input => this.state.formFields.end = input}
                    withRef
                    onChange={this.validationState('end')}
                  />
                </Col>
                <Col sm={4} className={s.showEndTime}>
                  <a onClick={this.hideEndTime}>Ẩn</a>
                </Col>
                <Clearfix />
              </FormGroup>
              )}

              <FormGroup validationState={this.state.validationState.message}>
                <ControlLabel className="col-sm-3">Miêu tả</ControlLabel>
                <Col sm={9}>
                  <Field
                    type="textarea"
                    name="message"
                    component={ReduxFormFields.EditorField}
                    className={s.editor}
                    validate={[Validator.Required(null, 'Bạn phải nhập dữ liệu')]}
                    ref={input => this.state.formFields.message = input}
                    withRef
                    onChange={this.validationState('message')}
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
                  type="input"
                  name="privacy"
                  component={ReduxFormFields.HiddenField}
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
