import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  Button,
  Image,
  Dropdown,
  MenuItem,
  Col,
  ControlLabel,
  FormGroup,
  Clearfix,
 } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { graphql, compose } from 'react-apollo';
import moment from 'moment';
import gql from 'graphql-tag';
import DateTime from 'react-datetime';
import Draft, {
  Editor,
  EditorState,
  CompositeDecorator,
  convertToRaw,
} from 'draft-js';
import classNames from 'classnames';
import { generate as idRandom } from 'shortid';
import history from '../../core/history';
import uploadImage from '../../utils/uploadImage';
import {
  HANDLE_REGEX,
  HASHTAG_REGEX,
  PUBLIC,
  FRIEND,
  ONLY_ME,
} from '../../constants';
import InputWithValidation from './InputWithValidation';
import HandleSpan from '../Common/Editor/HandleSpan';
import HashtagSpan from '../Common/Editor/HashtagSpan';
import s from './CreateEventModal.scss';

const PRIVARY_TEXT = {
  ONLY_ME: 'Chỉ mình tôi',
  PUBLIC: 'Công khai',
  FRIEND: 'Bạn bè',
};

const CustomToggle = ({ onClick, children }) => (
  <Button onClick={onClick}>
    { children }
  </Button>
);

CustomToggle.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node,
};

const findWithRegex = (regex, contentBlock, callback) => {
  const text = contentBlock.getText();
  let start;
  let matchArr = regex.exec(text);
  while (matchArr !== null) {
    start = matchArr.index;
    callback(start, start + matchArr[0].length);
    matchArr = regex.exec(text);
  }
};

const handleStrategy = (contentBlock, callback) => {
  findWithRegex(HANDLE_REGEX, contentBlock, callback);
};

const hashtagStrategy = (contentBlock, callback) => {
  findWithRegex(HASHTAG_REGEX, contentBlock, callback);
};

const compositeDecorator = new CompositeDecorator([{
  strategy: handleStrategy,
  component: HandleSpan,
},
{
  strategy: hashtagStrategy,
  component: HashtagSpan,
}]);

class CreateEventModal extends Component {
  state = {
    editorState: EditorState.createEmpty(compositeDecorator),
    nameEvent: '',
    validationNameEventText: '',
    photos: '',
    start: moment(),
    end: moment(),
    location: '',
    privacy: PUBLIC,
    validateDescriptionText: '',
    hasFocusEditor: false,
  };

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

  onFilePicked = (input) => {
    this.uploadImages(input.target.files[0]);
  }

  onSelectPrivary = (eventKey, event) => {
    event.preventDefault();
    this.setState({
      privacy: eventKey,
    });
  }

  onSubmit = async () => {
    const { privacy, photos, nameEvent, location, start, end } = this.state;
    const message = JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent()));
    if (photos.length === 0) {
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

    if (start.toDate() > end.toDate()) {
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
      privacy,
      photos: [photos],
      name: nameEvent,
      location,
      start: start.toDate(),
      end: end.toDate(),
      message,
    });
    this.props.closeModal();
    this.setState({
      editorState: EditorState.createEmpty(compositeDecorator),
      nameEvent: '',
      validationNameEventText: '',
      photos: '',
      start: moment(),
      end: moment(),
      location: '',
      privacy: PUBLIC,
      validateDescriptionText: '',
    });
    history.push(`/events/${res.data.createNewEvent._id}`);
  }
  onDescriptionChange = (e) => {
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

  onChangeMessage = (editorState) => {
    this.setState(prevState => ({
      ...prevState,
      editorState,
    }));
  }

  uploadImages = async (file) => {
    try {
      const result = await uploadImage(file);
      this.setState({
        photos: result.url,
      });
    } catch (err) {
      throw err;
    }
  }

  _keyBindingFn = (e) => {
    if (e.keyCode === 13 && !e.altKey) {
      return 'onSubmit';
    }
    return Draft.getDefaultKeyBinding(e);
  }

  _handleKeyCommand = (command) => {
    const { isSubmit } = this.state;
    if (command === 'onSubmit' && isSubmit) {
      this.onSubmit();
    }
    return 'not-handler';
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

  render() {
    const { editorState } = this.state;
    return (
      <Modal show={this.props.show} onHide={this.props.closeModal}>
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
                      onClick={() => {
                        document.getElementById('fileInEvent').click();
                      }}
                      className={classNames('btn-upload', s.btnUpload)}
                    >
                      <i className="fa fa-camera" aria-hidden="true"></i>
                      <strong>  Đăng hình</strong>
                      <input
                        accept="image/*"
                        className="hide"
                        id="fileInEvent"
                        type="file"
                        onChange={this.onFilePicked}
                      />
                    </Button>
                  </div>
                  {this.state.photos.length > 0 ?
                    <div className={s.imgThumbnail}>
                      <Image
                        src={this.state.photos}
                        responsive
                        className={s.imgResponsive}
                      />
                    </div> : null}
                </div>
              </Col>
            </FormGroup>

            <FormGroup>
              <ControlLabel className="col-sm-3">Tên sự kiện</ControlLabel>
              <Col sm={9}>
                <InputWithValidation
                  id="nameEventId"
                  validationState={this.validationForNameEvent}
                  helpText="Tên sự kiện quá ngắn"
                  onTextChange={this.onEventNameChange}
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
              <ControlLabel className="col-sm-3">Bắt đầu</ControlLabel>
              <Col sm={9}>
                <DateTime
                  inputProps={{
                    readOnly: true,
                  }}
                  disableOnClickOutside
                  closeOnSelect
                  closeOnTab
                  input
                  defaultValue={this.state.start}
                  onChange={(start) => {
                    this.setState({
                      start,
                    });
                  }}
                  value={this.state.start}
                />
              </Col>
            </FormGroup>

            <FormGroup>
              <ControlLabel className="col-sm-3">Kết thúc</ControlLabel>
              <Col sm={9}>
                <DateTime
                  inputProps={{
                    readOnly: true,
                  }}
                  disableOnClickOutside
                  closeOnSelect
                  closeOnTab
                  input
                  defaultValue={this.state.end}
                  onChange={(end) => {
                    this.setState({
                      end,
                    });
                  }}
                  value={this.state.end}
                />
              </Col>
            </FormGroup>

            <FormGroup>
              <ControlLabel className="col-sm-3">Miêu tả</ControlLabel>
              <Col sm={9}>
                <div className={classNames('form-control', s.editor, { focus: this.state.hasFocusEditor })} onClick={() => this.editor.focus()}>
                  <Editor
                    editorState={editorState}
                    onChange={this.onChangeMessage}
                    placeholder="Mô tả sự kiện"
                    ref={editor => this.editor = editor}
                    onFocus={() => this.setState({ hasFocusEditor: true })}
                    onBlur={() => this.setState({ hasFocusEditor: false })}
                    spellCheck
                  />
                </div>
                {this.state.validateDescriptionText.length > 0 ? <div className={s.errorText}>{this.state.validateDescriptionText}</div> : null}
              </Col>
            </FormGroup>

          </Col>
          <Clearfix />
        </Modal.Body>
        <Modal.Footer>
          <Dropdown
            className={s.setPrivaryBtn}
            style={{ marginRight: '5px' }}
            id={idRandom()}
            pullRight
          >
            <CustomToggle bsRole="toggle">
              <span title={PRIVARY_TEXT[this.state.privacy]}>
                {PRIVARY_TEXT[this.state.privacy]} <i className="fa fa-caret-down" aria-hidden="true"></i>
              </span>
            </CustomToggle>
            <Dropdown.Menu onSelect={this.onSelectPrivary}>
              <MenuItem eventKey={PUBLIC}>Công khai</MenuItem>
              <MenuItem eventKey={FRIEND}>Bạn bè</MenuItem>
              <MenuItem eventKey={ONLY_ME}>Chỉ mình tôi</MenuItem>
            </Dropdown.Menu>
          </Dropdown>
          <Button onClick={this.props.closeModal}>Hủy bỏ</Button>
          <Button bsStyle="primary" onClick={this.onSubmit}>Đăng bài</Button>
        </Modal.Footer>
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
  createNewEvent: gql`mutation createNewEvent ($input: CreateEventInput!) {
    createNewEvent (input: $input) {
      ...EventView
    }
  }
  ${CreateEventModal.fragments.event}
  `,
};

export default compose(
  withStyles(s),
  graphql(CreateEventModal.mutation.createNewEvent, {
    props: ({ mutate }) => ({
      createNewEvent: input => mutate({
        variables: { input },
      }),
    }),
  }),
)((CreateEventModal));
