import React, { Component, PropTypes } from 'react';
import { Modal, Button, Image, Dropdown, MenuItem } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './CreateEventModal.scss';
import { graphql, compose } from 'react-apollo';
import InputWithValidation from './InputWithValidation';
import moment from 'moment';
import { generate as idRandom } from 'shortid';
import uploadImage from '../../utils/uploadImage';
import { PRIVATE_EVENT, PUBLIC_EVENT } from '../../constants';
import Draft from 'draft-js';
import gql from 'graphql-tag';

import DateTime from 'react-datetime';

// const DateTimeField = require('react-bootstrap-datetimepicker');

const PRIVARY_TEXT = {
  PRIVATE_EVENT: 'Riêng tư',
  PUBLIC_EVENT: 'Công khai',
};

moment.locale('vi');

const CustomToggle = ({ onClick, children }) => (
  <Button onClick={onClick}>
    { children }
  </Button>
);

CustomToggle.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node,
};

class CreateEventModal extends Component {
  state = {
    nameEvent: '',
    validationNameEventText: '',
    bannerUrl: '',
    start: moment(),
    end: moment(),
    location: '',
    description: '',
    privary: PUBLIC_EVENT,
    validateDescriptionText: '',
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
      privary: eventKey,
    });
  }

  onSubmit = () => {
    const { privary, bannerUrl, nameEvent, location, start, end, description } = this.state;

    if (bannerUrl.length === 0) {
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

    if (description.length <= 10) {
      this.setState({
        validateDescriptionText: 'Mô tả quá ngắn',
      });
      return;
    }

    this.props.createNewEvent(privary, bannerUrl, nameEvent, location, start.toDate(), end.toDate(), description);
    this.props.closeModal();
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

  uploadImages = async (file) => {
    try {
      const result = await uploadImage(file);
      this.setState({
        bannerUrl: result.url,
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
    return (
      <Modal show={this.props.show} onHide={this.props.closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Tạo sự kiện</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={s.BodyModal}>
            <div className={s.rowItem}>
              <div className={s.leftColumn}><strong>Ảnh sự kiện</strong></div>
              <div className={`${s.rightColumn} ${s.border}`}>
                <div className={s.layoutForButtonUpload}>
                  <Button
                    onClick={() => {
                      document.getElementById('fileInEvent').click();
                    }}
                    className={s.btnUpload}
                  >
                    <i className="fa fa-camera" aria-hidden="true"></i>
                    <strong>  Đăng hình</strong>
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="fileInEvent"
                      type="file"
                      onChange={this.onFilePicked}
                    />
                  </Button>
                </div>
                {this.state.bannerUrl.length > 0 ?
                  <div className={s.wrapperImage}>
                    <Image
                      style={{ maxHeight: '100%' }}
                      src={this.state.bannerUrl}
                      responsive
                    />
                  </div> : null}
              </div>
            </div>
            <div className={s.rowItem}>
              <div className={s.leftColumn}><strong className={s.fieldNameCenter}>Tên sự kiện</strong></div>
              <div className={s.rightColumn}>
                <InputWithValidation
                  id="nameEventId"
                  validationState={this.validationForNameEvent}
                  helpText="Tên sự kiện quá ngắn"
                  textHolder=""
                  onTextChange={this.onEventNameChange}
                />
              </div>
            </div>
            <div className={s.rowItem}>
              <div className={s.leftColumn}><strong className={s.fieldNameCenter}>Vị trí</strong></div>
              <div className={s.rightColumn}>
                <InputWithValidation
                  id="locationEventId"
                  validationState={this.validationForNameEvent}
                  helpText="Vị trí không hợp lệ"
                  textHolder=""
                  onTextChange={this.onEventLocationChange}
                />
              </div>
            </div>
            <div className={s.rowItem}>
              <div className={s.leftColumn}><strong className={s.fieldNameCenter}>Bắt đầu</strong></div>
              <div className={s.rightColumn}>
                <DateTime
                  locale="vi"
                  inputProps={{
                    readOnly: true,
                    placeholder: 'hihi',
                  }}
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
                  style={{ marginBottom: '5px' }}
                />
              </div>
            </div>
            <div className={s.rowItem}>
              <div className={s.leftColumn}><strong className={s.fieldNameCenter}>Kết thúc</strong></div>
              <div className={s.rightColumn}>
                <DateTime
                  locale="vi"
                  inputProps={{
                    readOnly: true,
                    placeholder: 'hihi',
                  }}
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
                  style={{ marginBottom: '5px' }}
                />
              </div>
            </div>
            <div className={s.rowItem}>
              <div className={s.leftColumn}><strong className={s.fieldNameCenter}>Miêu tả</strong></div>
              <div className={s.rightColumn}>
                <textarea
                  placeholder="Mô tả sự kiện"
                  id="txtArea"
                  className={s.txtArea}
                  value={this.state.description}
                  onChange={this.onDescriptionChange}
                />
                {this.state.validateDescriptionText.length > 0 ? <div className={s.errorText}>{this.state.validateDescriptionText}</div> : null}
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Dropdown
            className={s.setPrivaryBtn}
            style={{ marginRight: '5px' }}
            id={idRandom()}
            pullRight
          >
            <CustomToggle bsRole="toggle">
              <span title={PRIVARY_TEXT[this.state.privary]}>
                {PRIVARY_TEXT[this.state.privary]} <i className="fa fa-caret-down" aria-hidden="true"></i>
              </span>
            </CustomToggle>
            <Dropdown.Menu onSelect={this.onSelectPrivary}>
              <MenuItem eventKey={PUBLIC_EVENT}>Công khai</MenuItem>
              <MenuItem eventKey={PRIVATE_EVENT}>Riêng tư</MenuItem>
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
  createNewEvent: PropTypes.func,
};
CreateEventModal.fragments = {
  event: gql`
    fragment EventView on Event{
      _id
      privacy
      isDeleted
      author {
        _id
        username
        profile {
          picture
          firstName
          lastName
        }
      }
      banner
      name
      location
      start
      end
      description
    }
  `,
};
CreateEventModal.mutation = {
  createNewEvent: gql`mutation createNewEvent ($privacy: PrivacyEvent!, $banner: String!, $name: String!, $location: String!, $start: Date!, $end: Date!, $description: String!) {
    createNewEvent (privacy: $privacy, banner: $banner, name: $name, location: $location, start: $start, end: $end, description: $description) {
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
      createNewEvent: (privacy, banner, name, location, start, end, description) => mutate({
        variables: { privacy, banner, name, location, start, end, description },
      }),
    }),
  }),
)((CreateEventModal));
