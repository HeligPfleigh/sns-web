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
 } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { graphql, compose } from 'react-apollo';
import moment from 'moment';
import gql from 'graphql-tag';
import DateTime from 'react-datetime';
import { reduxForm, Field } from 'redux-form';
import * as _ from 'lodash';
import Editor, { EditorState } from 'draft-js';

import { Privacy } from '../../Dropdown';
import { DraftEditor, RTE, createEditorState } from '../../Editor';
import { SingleUploadFile } from '../../ApolloUpload';
import MakeFormSafe from './MakeFormSafe';
import s from './EditEvent.scss';

const ReduxFormInputControl = ({ input, meta, ...props }) => <FormControl {...input} {...props} />;
ReduxFormInputControl.propTypes = {
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
};

const ReduxFormDateTimeControl = ({ input, meta, ...props }) => <DateTime {...input} {...props} />;
ReduxFormDateTimeControl.propTypes = {
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
};

const ReduxFormEditorControl = ({ input: { editorState, onChange, ...input }, meta, ...props }) => {
  console.log(input, meta, ...props);
  // return <FormControl {...input} {...props} />;
  return <Editor editorState={editorState} onChange={onChange} />;
};
ReduxFormEditorControl.propTypes = {
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
};

const withMoment = value => value && moment(value);
const withSingleImage = value => _.isArray(value) && _.head(value);
// const withEditorState = (value) => {
//   let isValid = true;
//   try {
//     value = JSON.parse(value);
//   } catch (e) {
//     isValid = false;
//   }

//   return isValid ? DraftEditor.EditorState.createWithContent(DraftEditor.convertFromRaw(value)) : value;
// };

class EditEventModal extends Component {
  constructor(props, ...args) {
    super(props, ...args);

    this.state = {
      photo: _.isArray(props.initialValues.photos) && _.head(props.initialValues.photos),
      showEndTime: !_.isUndefined(props.initialValues.end),
      editorState: createEditorState(props.initialValues.message),
    };

    this.onUploadSuccess = this.onUploadSuccess.bind(this);
    this.onUploadClick = this.onUploadClick.bind(this);
    this.showEndTime = this.showEndTime.bind(this);
    this.hideEndTime = this.hideEndTime.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onEditorChange = this.onEditorChange.bind(this);
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

  onSubmit(data) {
    const {
      _id,
      privacy,
      photos,
      name,
      location,
      start,
      end,
      message,
      invites,
    } = data;
    console.log({
      _id,
      privacy,
      photos,
      name,
      location,
      start,
      end,
      message,
      invites,
    });
    // this.props.saveEvent(data._id, {
    //   _id,
    //   privacy,
    //   photos,
    //   name,
    //   location,
    //   start,
    //   end,
    //   message,
    //   invites,
    // });
  }

  onEditorChange(event, editorState) {
    this.props.change('message', JSON.stringify(editorState.toJS()));
    this.setState({ editorState });
    console.log(editorState, JSON.stringify(editorState.toJS()));
  }

  render() {
    const { handleSubmit, pristine, submitting, invalid } = this.props;
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
                          component={ReduxFormInputControl}
                          format={withSingleImage}
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
                    component={ReduxFormInputControl}
                  />
                </Col>
              </FormGroup>

              <FormGroup>
                <ControlLabel className="col-sm-3">Vị trí</ControlLabel>
                <Col sm={9}>
                  <Field
                    type="text"
                    name="location"
                    component={ReduxFormInputControl}
                  />
                </Col>
              </FormGroup>

              <FormGroup>
                <ControlLabel className="col-sm-3">{ this.state.showEndTime ? 'Bắt đầu' : 'Ngày / Giờ' }</ControlLabel>
                <Col sm={5}>
                  <Field
                    type="text"
                    name="start"
                    component={ReduxFormDateTimeControl}
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
                    component={ReduxFormDateTimeControl}
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
                    component={ReduxFormEditorControl}
                    className={s.editor}
                    onChange={this.onEditorChange}
                    editorState={this.state.editorState}
                  />
                </Col>
              </FormGroup>

            </Col>
            <Clearfix />
          </Modal.Body>
          <Modal.Footer>
            <Privacy ref={privacy => this.privacyRef = privacy} className={s.btnPrivacies} />
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
  ],
  touchOnChange: true,
  touchOnBlur: true,
  enableReinitialize: true,
})(compose(
  withStyles(s),
  graphql(gql`mutation editEvent ($input: EditEventInput!) {
    editEvent (input: $input) {
      ...EventView
    }
  }
  fragment EventView on Event {
      _id
      privacy
      author {
        _id
        username
        profile {
          picture
          firstName
          lastName
        }
      }
      photos
      name
      location
      start
      end
      message
    }
  `, {
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
