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
 } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { graphql, compose } from 'react-apollo';
import moment from 'moment';
import DateTime from 'react-datetime';
import { reduxForm, Field } from 'redux-form';
import isArray from 'lodash/isArray';
import head from 'lodash/head';
import isUndefined from 'lodash/isUndefined';
import isFunction from 'lodash/isFunction';

import { Privacy } from '../../Dropdown';
import Validator from '../../Validator';
import { DraftEditor } from '../../Editor';
import { SingleUploadFile } from '../../ApolloUpload';
// import MakeFormSafe from './MakeFormSafe';
import editEventMutation from './editEventMutation.graphql';
import s from './EditEvent.scss';

const withMoment = value => value && moment(value);

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
  render() {
    const { input, meta: { touched, error, warn }, ...props } = this.props;
    return (<div>
      <DateTime {...input} {...props} />
      {touched && (error || warn) && <HelpBlock>{error || warn}</HelpBlock>}
    </div>);
  }
}
ReduxFormDateTimeField.propTypes = {
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
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
    this.onSubmit = this.onSubmit.bind(this);
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

  onSubmit({
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
    this.props.saveEvent(_id, {
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

  onPrivacySelected(privacy) {
    this.setState({
      privacy,
    });

    this.props.change('privacy', privacy);
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
    const { handleSubmit, pristine, submitting, invalid, form } = this.props;
    return (
      <Modal show={this.props.show} onHide={this.props.onHide} backdrop="static">
        <form name="EditEvent" noValidate onSubmit={handleSubmit(this.onSubmit)}>
          <Modal.Header closeButton>
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
                    inputProps={{
                      readOnly: true,
                    }}
                    format={withMoment}
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
                    inputProps={{
                      readOnly: true,
                    }}
                    format={withMoment}
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
            <Privacy ref={privacy => this.privacyRef = privacy} className={s.btnPrivacies} onSelect={this.onPrivacySelected} value={this.state.privacy} />
            <Field
              type="hidden"
              name="privacy"
              component={ReduxFormHiddenField}
            />
            <Button onClick={this.props.onHide}>Hủy bỏ</Button>
            <Button type="submit" bsStyle="primary" disabled={pristine || submitting || invalid}>Đăng bài</Button>
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
  saveEvent: PropTypes.func.isRequired,
};

EditEventModal.defaultProps = {
  show: false,
  onHide: () => undefined,
};

export default reduxForm({
  form: 'EditEvent',
  fields: [
    'name',
    'photos',
    'start',
    'end',
    'location',
    'message',
    'privacy',
  ],
  touchOnChange: true,
  touchOnBlur: true,
  enableReinitialize: true,
})(compose(
  withStyles(s),
  graphql(editEventMutation, {
    props: ({ mutate }) => ({
      saveEvent: (_id, data) => mutate({
        variables: {
          input: {
            _id,
            ...data,
          },
        },
      }),
    }),
  }),
)(EditEventModal));
