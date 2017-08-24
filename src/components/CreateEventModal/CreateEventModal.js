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
  FormControl,
  HelpBlock,
 } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { graphql, compose } from 'react-apollo';
import moment from 'moment';
import gql from 'graphql-tag';
import ReactDatetime from 'react-datetime';
import { Field, reduxForm } from 'redux-form';
import history from '../../core/history';
import { SingleUploadFile } from '../ApolloUpload';
import InputWithValidation from './InputWithValidation';
import { Privacy } from '../Dropdown';
import { DraftEditor } from '../Editor';
import { required, maxLength, hasSpecialChart } from '../../utils/validator';
import s from './CreateEventModal.scss';

const CustomToggle = ({ onClick, children }) => (
  <Button onClick={onClick}>
    { children }
  </Button>
);

CustomToggle.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node,
};

const ReduxFormControl = ({ input, meta: { error, touched, warning }, ...props }) => {
  console.log(error, touched, warning);
  return (<div>
    <FormControl {...props} {...input} />
    {touched && ((error && <HelpBlock>{error}</HelpBlock>) || (warning && <HelpBlock>{warning}</HelpBlock>))}
  </div>);
};

ReduxFormControl.propTypes = {
  input: PropTypes.object,
  meta: PropTypes.object,
};

class CreateEventModal extends Component {

  constructor(...args) {
    super(...args);

    this.reset();

    this.onUploadError = this.onUploadError.bind(this);
    this.onUploadSuccess = this.onUploadSuccess.bind(this);
    this.onUploadClick = this.onUploadClick.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.displayEndTime = this.displayEndTime.bind(this);
    this.hideEndTime = this.hideEndTime.bind(this);
  }

  onUploadError() {
    this.setState({
      photos: null,
    });
  }

  onUploadSuccess({ uploadSingleFile }) {
    this.setState({
      photos: uploadSingleFile.file.url,
    });
  }

  onUploadClick() {
    this.state.inputUpload.click();
  }

  onEventNameChange = (value) => {
    this.setState({
      nameEvent: value,
    });
  }

  onEventLocationChange = (value) => {
    this.setState({
      location: value,
    });
  }

  async onSubmit(...args) {
    console.log(...args);
    const { photos, nameEvent, location, startDate, endDate } = this.state;
    const message = this.editor.getCurrentContent();
    if (!photos) {
      this.setState({
        validateDescriptionText: 'Vui lòng chọn ảnh sự kiện',
      });
      return;
    }

    if (nameEvent.length <= 10) {
      this.setState({
        validateDescriptionText: 'Tên sự kiện quá ngắn',
      });
      return;
    }

    if (location.length <= 10) {
      this.setState({
        validateDescriptionText: 'Địa điểm quá ngắn',
      });
      return;
    }

    if (startDate.toDate() > endDate.toDate()) {
      this.setState({
        validateDescriptionText: 'Thời gian kết thúc cần lớn hơn thời gian bắt đầu',
      });
      return;
    }

    if (message.length <= 10) {
      this.setState({
        validateDescriptionText: 'Mô tả quá ngắn',
      });
      return;
    }

    const res = await this.props.createNewEvent({
      privacy: this.privacy.getCurrentValue(),
      photos: [photos],
      name: nameEvent,
      location,
      start: startDate.toDate(),
      end: endDate.toDate(),
      message,
    });
    this.props.closeModal();
    this.reset();
    history.push(`/events/${res.data.createNewEvent._id}`);
  }

  onDescriptionChange(e) {
    if (this.state.description.length <= 10) {
      this.setState({
        validateDescriptionText: '*mô tả quá ngắn',
      });
    } else {
      this.setState({
        validateDescriptionText: '',
      });
    }
    this.setState({
      description: e.target.value,
    });
  }

  reset() {
    this.state = {
      nameEvent: '',
      validationNameEventText: '',
      photos: null,
      startDate: moment(),
      endDate: moment().add(3, 'hours'),
      location: '',
      validateDescriptionText: '',
      hasFocusEditor: false,
      inputUpload: null,
      displayEndTime: false,
    };
  }

  validationForLocationEvent = (text) => {
    if (text.length > 5) {
      return true;
    }
    return false;
  }

  validationForNameEvent = (text) => {
    if (text.length > 10) {
      return true;
    }
    return false;
  }

  displayEndTime(event) {
    event.preventDefault();
    this.setState({
      displayEndTime: true,
    });
  }

  hideEndTime(event) {
    event.preventDefault();
    this.setState({
      displayEndTime: false,
    });
  }

  render() {
    const {
      handleSubmit,
      submitting,
      pristine,
      invalid,
      fields: [
        eventName,
      ],
    } = this.props;
    return (
      <Modal show={this.props.show} onHide={this.props.closeModal} keyboard={false} backdrop="static">
        <form className="form-horizontal" onSubmit={handleSubmit(this.onSubmit)}>
          <Modal.Header closeButton>
            <Modal.Title>Tạo sự kiện</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Col xs={12}>
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
                        <SingleUploadFile className="hide" inputRef={input => this.state.inputUpload = input} onSuccess={this.onUploadSuccess} onError={this.onUploadError} />
                      </Button>
                    </div>
                    {this.state.photos && (
                    <div className={s.imgThumbnail}>
                      <Image
                        src={this.state.photos}
                        responsive
                        className={s.imgResponsive}
                      />
                    </div>
                  )}
                  </div>
                </Col>
              </FormGroup>

              <FormGroup controlId={eventName}>
                <ControlLabel className="col-sm-3">Tên sự kiện</ControlLabel>
                <Col sm={9}>
                  <Field
                    type="text"
                    name={eventName}
                    id={eventName}
                    placeholder="Nhập tên sự kiện"
                    component={ReduxFormControl}
                    validate={[required, maxLength(10), hasSpecialChart]}
                  />
                </Col>
              </FormGroup>

              <FormGroup>
                <ControlLabel className="col-sm-3">Vị trí</ControlLabel>
                <Col sm={9}>
                  <InputWithValidation
                    id="locationEventId"
                    validationState={this.validationForNameEvent}
                    helpText="Vị trí không hợp lệ"
                    textHolder=""
                    onTextChange={this.onEventLocationChange}
                  />
                </Col>
              </FormGroup>

              <FormGroup>
                <ControlLabel className="col-sm-3">{ this.state.displayEndTime ? 'Bắt đầu' : 'Ngày / Giờ' }</ControlLabel>
                <Col sm={5}>
                  <ReactDatetime
                    inputProps={{
                      readOnly: true,
                    }}
                    disableOnClickOutside
                    closeOnSelect
                    closeOnTab
                    input
                    defaultValue={this.state.startDate}
                    onChange={(startDate) => {
                      this.setState({
                        startDate,
                      });
                    }}
                    value={this.state.startDate}
                  />
                </Col>
                {!this.state.displayEndTime && (
                <Col sm={4} className={s.displayEndTime}>
                  <a onClick={this.displayEndTime}>+ Thời gian kết thúc</a>
                </Col>
              )}
              </FormGroup>

              {this.state.displayEndTime && (
                <FormGroup>
                  <ControlLabel className="col-sm-3">Kết thúc</ControlLabel>
                  <Col sm={5}>
                    <ReactDatetime
                      inputProps={{
                        readOnly: true,
                      }}
                      disableOnClickOutside
                      closeOnSelect
                      closeOnTab
                      input
                      defaultValue={this.state.endDate}
                      onChange={(endDate) => {
                        this.setState({
                          endDate,
                        });
                      }}
                      value={this.state.endDate}
                    />
                  </Col>
                  <Col sm={4} className={s.displayEndTime}>
                    <a onClick={this.hideEndTime}>Xóa</a>
                  </Col>
                </FormGroup>
              )}

              <FormGroup>
                <ControlLabel className="col-sm-3">Miêu tả</ControlLabel>
                <Col sm={9}>
                  <DraftEditor className={s.editor} placeholder="Mô tả sự kiện" ref={editor => this.editor = editor} />
                  {this.state.validateDescriptionText.length > 0 ? <div className={s.errorText}>{this.state.validateDescriptionText}</div> : null}
                </Col>
              </FormGroup>

            </Col>
            <Clearfix />
          </Modal.Body>
          <Modal.Footer>
            <Privacy className={s.btnPrivacies} ref={privacy => this.privacy = privacy} />
            <Button onClick={this.props.closeModal}>Hủy bỏ</Button>
            <Button bsStyle="primary" disabled={pristine || submitting || invalid}>Đăng bài</Button>
          </Modal.Footer>
        </form>
      </Modal>
    );
  }
}

CreateEventModal.propTypes = {
  show: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  createNewEvent: PropTypes.func.isRequired,
};

CreateEventModal.fragments = {
  event: gql`
    fragment EventView on Event{
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
  `,
};

CreateEventModal.mutation = {
  createNewEvent: gql`mutation createNewEvent ($input: CreateNewEventAnnouncementInput!) {
    createNewEvent (input: $input) {
      ...EventView
    }
  }
  ${CreateEventModal.fragments.event}
  `,
};

const fields = ['eventName'];
const validate = (values, props) => {
  console.log(values, props);
  const errors = {};
  return errors;
};

export default reduxForm({
  form: 'createNewEvent',
  fields,
  touchOnBlur: true,
  touchOnChange: true,
  validate,
})(compose(
  withStyles(s),
  graphql(CreateEventModal.mutation.createNewEvent, {
    props: ({ mutate }) => ({
      createNewEvent: input => mutate({
        variables: { input },
      }),
    }),
  }),
)((CreateEventModal)));
