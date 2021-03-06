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
import { reduxForm, Field, formValueSelector, reset as resetReduxForm } from 'redux-form';
import isArray from 'lodash/isArray';
import head from 'lodash/head';
import isUndefined from 'lodash/isUndefined';
// import isFunction from 'lodash/isFunction';
import { connect } from 'react-redux';
import classNames from 'classnames';

import history from '../../../core/history';
import { Privacy } from '../../Dropdown';
import Validator from '../../Validator';
import { SingleUploadFile } from '../../ApolloUpload';
import * as ReduxFormFields from './FormFields';
import { PUBLIC } from '../../../constants';
import s from './EditEvent.scss';

class EditEventModal extends Component {
  constructor(props, ...args) {
    super(props, ...args);

    const { initialValues, user: { buildings } } = props;

    this.state = {
      photo: isArray(initialValues.photos) && head(initialValues.photos),
      showEndTime: !isUndefined(initialValues.end),
      validationState: {},
    };

    this.formFields = {};

    if (Array.isArray(buildings)) {
      this.building = buildings[0]._id || undefined;
    }

    // this.onUploadSuccess = this.onUploadSuccess.bind(this);
    // this.onUploadClick = this.onUploadClick.bind(this);
    // this.showEndTime = this.showEndTime.bind(this);
    // this.hideEndTime = this.hideEndTime.bind(this);
    // this.onPrivacySelected = this.onPrivacySelected.bind(this);
    // this.onUpdate = this.onUpdate.bind(this);
    // this.onDelete = this.onDelete.bind(this);
    // this.validationState = this.validationState.bind(this);
  }


  onUploadSuccess = ({ uploadSingleFile }) => {
    this.setState({
      photo: uploadSingleFile.file.url,
    });

    this.props.change('photos', [uploadSingleFile.file.url]);
  }

  onUploadClick = () => {
    this.uploadRef.click();
  }

  onPrivacySelected = (privacy) => {
    this.props.change('privacy', privacy);
  }

  onUpdate = ({
      _id,
      privacy,
      photos,
      name,
      location,
      start,
      end,
      message,
      invites,
      building,
  }) => this.props.onUpdate(_id, {
    privacy,
    photos,
    name,
    location,
    start,
    end,
    message,
    invites,
    building: building ? this.building : undefined,
  })
    .then(() => this.props.onHide())
    .catch(() => this.props.onHide())

  onCancelEvent = () => {
    // this.props.onDelete(this.props.initialValues._id).then(() => {
    //   history.push('/events');
    // });
    this.props.showCancelEventModal();
  }

  onBuldingEventChange = (event) => {
    const { currentValues } = this.props;
    this.onPrivacySelected(event.target.checked ? PUBLIC : currentValues.privacy);
  }

  showEndTime = (event) => {
    event.preventDefault();

    this.setState({
      showEndTime: true,
    });
  }

  hideEndTime = (event) => {
    event.preventDefault();

    this.setState({
      showEndTime: false,
    });
  }

  // eslint-disable-next-line
  validationState = (fieldName) => {
    return () => null;
    // return () => {
    //   try {
    //     const fieldComponent = this.formFields[fieldName];
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

  hideModal = () => {
    this.props.resetForm();
    this.props.onHide();
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
      isHideModalBehindBackdrop,
    } = this.props;
    return (
      <Modal show={this.props.show} onHide={this.props.onHide} backdrop="static" style={{ zIndex: isHideModalBehindBackdrop ? 1039 : 1040 }}>
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
                          inputRef={(input) => { this.uploadRef = input; }}
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
                    ref={(input) => { this.formFields.name = input; }}
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
                    ref={(input) => { this.formFields.location = input; }}
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
                      (value) => {
                        const now = Validator.Date.withMoment().add(1, 'minutes');
                        return Validator.Date.isAfter(null, `Thời gian bắt đầu phải sau ${now.format('DD/MM/YYYY HH:mm')}`, now)(value);
                      },
                      (value, values) => Validator.Date.isBefore(null, `Thời gian bắt đầu phải trước ${Validator.Date.withMoment(values.end).format('DD/MM/YYYY HH:mm')}`, values.end)(value),
                    ]}
                    isValidDate={startOfDay => startOfDay.isAfter(Validator.Date.withMoment().subtract(1, 'day'))}
                    ref={(input) => { this.formFields.start = input; }}
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
                      (value) => {
                        const now = Validator.Date.withMoment().add(1, 'minutes');
                        return Validator.Date.isAfter(null, `Thời gian kết thúc phải sau ${now.format('DD/MM/YYYY HH:mm')}`, now)(value);
                      },
                      (value, values) => Validator.Date.isAfter(null, `Thời gian kết thúc phải sau ${Validator.Date.withMoment(values.start).format('DD/MM/YYYY HH:mm')}`, values.start)(value),
                    ]}
                    isValidDate={startOfDay => startOfDay.isAfter(Validator.Date.withMoment().subtract(1, 'day'))}
                    ref={(input) => { this.formFields.end = input; }}
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
                    ref={(input) => { this.formFields.message = input; }}
                    withRef
                    onChange={this.validationState('message')}
                  />
                </Col>
              </FormGroup>

              <FormGroup validationState={this.state.validationState.buildingEvent}>
                <Col sm={9} smOffset={3}>
                  <Field
                    type="checkbox"
                    name="building"
                    component={ReduxFormFields.CheckboxField}
                    // eslint-disable-next-line
                    ref={input => this.formFields.building = input}
                    withRef
                    onClick={this.onBuldingEventChange}
                    inline
                  >Sự kiện của tòa nhà</Field>
                </Col>
              </FormGroup>

            </Col>
            <Clearfix />
          </Modal.Body>
          <Modal.Footer>
            <ButtonToolbar>
              <Button onClick={this.onCancelEvent} className="btn-danger" disabled={!canDelete || submitting}>Hủy sự kiện</Button>
              <ButtonToolbar className="pull-right">
                <Privacy
                  className={s.btnPrivacies}
                  onSelect={this.onPrivacySelected}
                  value={currentValues.privacy}
                  disabled={!!currentValues.building}
                  // eslint-disable-next-line
                  ref={privacy => this.privacyRef = privacy}
                />
                <Field
                  type="input"
                  name="privacy"
                  component={ReduxFormFields.HiddenField}
                />
                <Button onClick={this.hideModal} disabled={submitting}>Đóng cửa sổ</Button>
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
  // onDelete: PropTypes.func.isRequired,
  showCancelEventModal: PropTypes.func.isRequired,
  currentValues: PropTypes.object,
  change: PropTypes.func.isRequired,
  resetForm: PropTypes.func.isRequired,
  user: PropTypes.shape({
    isAdmin: PropTypes.bool,
    buildings: PropTypes.array,
  }).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  invalid: PropTypes.any.isRequired,
  form: PropTypes.string,
  isHideModalBehindBackdrop: PropTypes.bool,
};

EditEventModal.defaultProps = {
  show: false,
  canUpdate: false,
  canDelete: false,
  onHide: () => undefined,
  currentValues: {},
  user: {
    isAdmin: false,
    buildings: [],
  },
};

const fields = [
  'name',
  'photos',
  'start',
  'end',
  'location',
  'message',
  'privacy',
  'building',
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
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  resetForm: () => dispatch(resetReduxForm('EditEvent')),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditEventForm);
