import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import classNames from 'classnames';
import {
  Col,
  Button,
  Clearfix,
} from 'react-bootstrap';
import {
  Editor,
  EditorState,
  convertToRaw,
  convertFromRaw,
} from 'draft-js';
import s from './EditPost.scss';
import ListImagePreview from '../../ListImagePreview';
import uploadImage from '../../../utils/uploadImage';

class EditPost extends Component {
  constructor(props) {
    super(props);
    const content = convertFromRaw(JSON.parse(this.props.message));

    this.state = {
      editorState: EditorState.createWithContent(content),
      isSubmit: true,
      photos: Array.from(this.props.photos || []),
    };
    this.onChange = editorState => this.setState({
      editorState,
      isSubmit: !editorState.getCurrentContent().getPlainText().trim(),
    });
  }

  onSubmit = (evt) => {
    evt.preventDefault();
    const data = JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent()));
    const { photos } = this.state;
    if (data === this.props.message && photos === this.props.photos) {
      this.props.closeEditPost();
    } else {
      this.props.onChange(data, photos);
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
          const result = await uploadImage('http://localhost:3005/upload/image', file);
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


  render() {
    const { className } = this.props;
    const { editorState, isSubmit, photos } = this.state;
    return (
      <div className={classNames(s.postContent, className)}>
        <Clearfix />
        <Col>
          <div
            title="Chỉnh sửa bài viết của bạn"
          >
            <Editor editorState={editorState} onChange={this.onChange} />
            {
              photos.length > 0 ?
                <div
                  className={s.listImagePreview}
                >
                  <ListImagePreview
                    images={photos}
                    onDeleteImage={this.onDeleteImage}
                  />
                </div> :
                null
            }
          </div>
        </Col>
        <Col style={{ borderTop: '1px solid #ddd', paddingTop: '10px' }}>
          <Col className="pull-left">
            <Button
              bsStyle="link"
              className={s.addPhoto}
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
          </Col>
          <Col className="pull-right">
            <Button title="Chỉnh sửa xong" bsStyle="primary" onClick={this.onSubmit} disabled={isSubmit}>Chỉnh sửa xong</Button>
          </Col>
          <Col className="pull-right">
            <Button title="Hủy" bsStyle="default" style={{ marginRight: '5px' }} onClick={this.props.closeEditPost}>Hủy</Button>
          </Col>
        </Col>
      </div>
    );
  }
}

EditPost.propTypes = {
  message: PropTypes.string.isRequired,
  photos: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  closeEditPost: PropTypes.func.isRequired,
};

export default withStyles(s)(EditPost);
