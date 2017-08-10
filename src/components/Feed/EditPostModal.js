import React, { Component, PropTypes } from 'react';
import { Modal, Button, ButtonToolbar, Dropdown, Clearfix, MenuItem } from 'react-bootstrap';
import {
  Editor,
  EditorState,
  convertToRaw,
  convertFromRaw,
} from 'draft-js';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import includes from 'lodash/includes';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import SharingPost from './SharingPost';
import ListImagePreview from '../ListImagePreview';
import { PUBLIC, FRIEND, ONLY_ME, ONLY_ADMIN_BUILDING } from '../../constants';
import uploadImage from '../../utils/uploadImage';
import s from './Feed.scss';

const styles = {
  editor: {
    // border: '1px solid #ddd',
    cursor: 'text',
    minHeight: 40,
    fontSize: '14px',
    padding: '10px 0px',
  },
};

class EditPostModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      isSubmit: true,
      photos: Array.from([]),
      isDelPostSharing: true,
      error: '',
    };

    this.onChange = editorStateChange => this.setState({
      editorState: editorStateChange,
      isSubmit: !editorStateChange.getCurrentContent().getPlainText().trim(),
    });
  }

  componentWillReceiveProps(nextProps) {
    const { dataPost: { message, photos, privacy }, isFocus } = nextProps;
    if (!isEqual(message, this.props.dataPost.message)) {
      let contentState = convertFromRaw(JSON.parse(message));
      // move focus to the end.
      contentState = EditorState.createWithContent(contentState);
      contentState = EditorState.moveFocusToEnd(contentState);
      this.setState({
        editorState: contentState,
      });
    }

    this.setState({
      photos: Array.from(photos || []),
      isSubmit: false,
      privacySelected: privacy || PUBLIC,
    });

    if (isFocus !== this.props.isFocus) {
      this.editor.focus();
    }
  }

  onDeleteImage = (index) => {
    const { photos } = this.state;
    photos.splice(index, 1);
    this.setState({
      photos,
      isSubmit: false,
    });
  }

  onFilePicked = (input) => {
    const { photos } = this.state;
    Object.keys(input.target.files).forEach((key) => {
      if (key !== 'length') {
        photos.push(input.target.files[key]);
      }
    });
    this.uploadImages(photos);
    this.setState({
      photos,
      isSubmit: false,
    });
  }

  onSubmit = (evt) => {
    const {
      dataPost: postData,
      dataPost: {
        message,
        photos: photosSource,
        privacy: privacySource,
      },
    } = this.props;
    const { photos = [], privacySelected: privacy = PUBLIC } = this.state;
    const content = JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent()));

    if (!isEqual(content, message) || !isEqual(photos, photosSource) || !isEqual(privacy, privacySource)) {
      const data = { ...postData, ...{ message: content, photos, privacy } };
      this.props.clickModal(evt, data, this.state.isDelPostSharing);
    } else {
      this.props.closeModal();
    }
  }

  onCancel = () => {
    const { dataPost: { message, photos } } = this.props;
    const content = JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent()));
    if (content !== message || !isEqual(photos, this.state.photos)) {
      this.props.showDiscardChangesPostModal();
    } else {
      this.props.closeModal();
    }
  }

  onSelectPrivacy = (privacySelected) => {
    if ([PUBLIC, FRIEND, ONLY_ME, ONLY_ADMIN_BUILDING].indexOf(privacySelected) === -1) {
      privacySelected = PUBLIC;
    }
    this.setState({
      privacySelected,
    });
  }

  uploadImages = (files) => {
    files.forEach(async (file, index) => {
      try {
        if (typeof file !== 'string') {
          const result = await uploadImage(file);
          const { photos } = this.state;
          photos[index] = result.url;
          this.setState({
            photos,
          });
        }
      } catch (err) {
        const { photos } = this.state;
        photos.splice(index, 1);
        this.setState({
          photos,
          error: 'Ảnh quá nặng hoặc tính năng đăng ảnh lỗi',
        });

        setTimeout(() => {
          this.setState({
            error: '',
          });
        }, 2000);
      }
    });
  }

  delPostSharing = () => {
    this.setState({
      isDelPostSharing: false,
    });
  }

  focus = () => this.editor.focus();

  render() {
    const { dataPost: { sharing, building }, isHideModalBehindBackdrop } = this.props;
    const { editorState, isSubmit, photos, isDelPostSharing, error } = this.state;
    const delBlockStyle = {
      position: 'absolute',
      zIndex: 1,
      top: '10px',
      right: '10px',
      cursor: 'pointer',
    };

    const privacies = {
      PUBLIC: {
        icon: <i className="fa fa-globe" aria-hidden="true"></i>,
        label: 'Công khai',
      },
      FRIEND: {
        icon: <i className="fa fa-users" aria-hidden="true"></i>,
        label: 'Bạn bè',
      },
      ONLY_ME: {
        icon: <i className="fa fa-lock" aria-hidden="true"></i>,
        label: 'Chỉ mình tôi',
      },
      ONLY_ADMIN_BUILDING: {
        icon: <i className="fa fa-bell" aria-hidden="true"></i>,
        label: 'Ban quản trị',
      },
    };

    const privacyKeys = Object.keys(privacies);
    const keySelected = privacyKeys.indexOf(this.state.privacySelected);
    const selectedKey = keySelected > -1 ? privacyKeys[keySelected] : PUBLIC;
    const selectedLabel = privacies[selectedKey].label;
    const selectedIcon = privacies[selectedKey].icon;
    delete privacies[selectedKey];

    let types = [PUBLIC, ONLY_ADMIN_BUILDING];
    if (isEmpty(building)) {
      types = [PUBLIC, FRIEND, ONLY_ME];
    }

    return (
      <Modal show={this.props.show} onHide={this.props.closeModal} style={{ zIndex: isHideModalBehindBackdrop ? 1039 : 1040 }}>
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa bài viết</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            style={styles.editor}
            onClick={this.focus}
            title="Chỉnh sửa bài viết của bạn"
          >
            <Editor
              spellCheck
              placeholder="Bạn đang nghĩ gì?"
              editorState={editorState}
              onChange={this.onChange}
              ref={(editor) => { this.editor = editor; }}
            />
            {
              photos.length > 0 ?
                <div
                  className="listImagePreview"
                >
                  <ListImagePreview
                    images={photos}
                    onDeleteImage={this.onDeleteImage}
                  />
                </div> :
                null
            }
            {error.length > 0 ? <span className={s.errorText}>{error}</span> : null}
          </div>
          {sharing && !isEmpty(sharing) && isDelPostSharing &&
            <div style={{ position: 'relative' }}>
              <i className="fa fa-times" style={delBlockStyle} aria-hidden="true" onClick={this.delPostSharing}></i>
              <SharingPost
                id={sharing._id}
                message={sharing.message}
                author={sharing.author}
                user={sharing.user}
                building={sharing.building}
                privacy={sharing.privacy}
                createdAt={sharing.createdAt}
              />
            </div>
          }
        </Modal.Body>
        <Modal.Footer>
          <ButtonToolbar className="pull-left">
            <Button
              bsStyle="link"
              style={{ color: '#4c4c4c', textDecorationLine: 'none', paddingLeft: '0px', outline: 'none' }}
              title="Đính kèm ảnh"
              onClick={() => document.getElementById('fileInputOnEdit').click()}
            >
              <i className="fa fa-camera fa-lg" aria-hidden="true"></i>&nbsp;
              <strong>Ảnh</strong>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="fileInputOnEdit"
                type="file"
                onChange={this.onFilePicked}
                multiple
              />
            </Button>
          </ButtonToolbar>
          <ButtonToolbar className="pull-right">
            <Dropdown className={s.sharingPostModalButtonPrivacies} id={Math.random()}>
              <Dropdown.Toggle>{ selectedIcon } { selectedLabel }</Dropdown.Toggle>
              <Dropdown.Menu onSelect={this.onSelectPrivacy}>
                { Object.keys(privacies).map(type => includes(types, type) && <MenuItem key={type} eventKey={type}>{ privacies[type].icon } { privacies[type].label }</MenuItem>) }
              </Dropdown.Menu>
            </Dropdown>
            <Button bsStyle="primary" onClick={this.onSubmit} disabled={isSubmit}>Chỉnh sửa xong</Button>
          </ButtonToolbar>
          <Clearfix />
        </Modal.Footer>
      </Modal>
    );
  }
}

EditPostModal.propTypes = {
  show: PropTypes.bool,
  closeModal: PropTypes.func,
  clickModal: PropTypes.func,
  dataPost: PropTypes.object.isRequired,
  isFocus: PropTypes.bool,
  showDiscardChangesPostModal: PropTypes.func,
  isHideModalBehindBackdrop: PropTypes.bool,
};


export default withStyles(s)(EditPostModal);
