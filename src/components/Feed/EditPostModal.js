import React, { Component, PropTypes } from 'react';
import { Modal, Button } from 'react-bootstrap';
import {
  Editor,
  EditorState,
  convertToRaw,
  convertFromRaw,
} from 'draft-js';
import isEmpty from 'lodash/isEmpty';
import SharingPost from './SharingPost';
import ListImagePreview from '../ListImagePreview';
import uploadImage from '../../utils/uploadImage';

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
    };

    this.onChange = editorStateChange => this.setState({
      editorState: editorStateChange,
      isSubmit: !editorStateChange.getCurrentContent().getPlainText().trim(),
    });
  }

  componentWillReceiveProps(nextProps) {
    const { dataPost: { message, photos }, isFocus } = nextProps;
    if (message) {
      const contentState = convertFromRaw(JSON.parse(message));
      // move focus to the end.
      this.state.editorState = EditorState.createWithContent(contentState);
      this.state.editorState = EditorState.moveFocusToEnd(this.state.editorState);
    }
    if (nextProps.isFocus !== isFocus) {
      this.editor.focus();
    }
    this.setState({
      editorState: this.state.editorState,
      photos: Array.from(photos || []),
    });
  }

  onSubmit = (evt) => {
    const { dataPost: postData } = this.props;
    const { dataPost: { message, photos } } = this.props;
    const content = JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent()));
    if (content === message && this.state.photos === photos) {
      this.props.closeModal();
    } else {
      const data = { ...postData, ...{ message: content, photos: this.state.photos || [] } };
      this.props.clickModal(evt, data, this.state.isDelPostSharing);
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
        console.log(err);
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
    const { dataPost: { sharing } } = this.props;
    const { editorState, isSubmit, photos, isDelPostSharing } = this.state;
    const delBlockStyle = {
      position: 'absolute',
      zIndex: 1,
      top: '10px',
      right: '10px',
      cursor: 'pointer',
    };
    return (
      <Modal show={this.props.show} onHide={this.props.closeModal}>
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
          <div style={{ float: 'left' }}>
            <Button
              bsStyle="link"
              style={{ color: '#4c4c4c', textDecorationLine: 'none' }}
              title="Đính kèm ảnh"
              onClick={() => {
                document.getElementById('fileInputOnEdit').click();
              }}
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
          </div>
          <Button onClick={this.props.closeModal}>Hủy</Button>
          <Button bsStyle="primary" onClick={this.onSubmit} disabled={isSubmit}>Chỉnh sửa xong</Button>
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
};


export default EditPostModal;
