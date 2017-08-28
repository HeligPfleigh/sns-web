import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import gql from 'graphql-tag';
import {
  Editor,
  EditorState,
  CompositeDecorator,
  convertToRaw,
} from 'draft-js';
import {
  Col,
  Clearfix,
  Button,
} from 'react-bootstrap';
import ListImagePreview from '../ListImagePreview';
import uploadImage from '../../utils/uploadImage';
import {
  HANDLE_REGEX,
  HASHTAG_REGEX,
} from '../../constants';
import s from './NewPost.scss';
import HandleSpan from '../Common/Editor/HandleSpan';
import HashtagSpan from '../Common/Editor/HashtagSpan';
import { Feed } from '../Feed';
import { MultipleUploadFile } from '../ApolloUpload';
import { Privacy } from '../Dropdown';

/**
 * Super simple decorators for handles and hashtags, for demonstration
 * purposes only. Don't reuse these regexes.
 */
const styles = {
  editor: {
    cursor: 'text',
    minHeight: 40,
    padding: '10px 0px',
  },
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

/** NewPost Component */
class NewPost extends Component {

  constructor(...args) {
    super(...args);

    this.state = {
      editorState: EditorState.createEmpty(compositeDecorator),
      isSubmit: true,
      photos: [],
      error: '',
      inputUpload: null,
    };

    this.onUploadClick = this.onUploadClick.bind(this);
    this.onUploadSuccess = this.onUploadSuccess.bind(this);
  }

  onUploadSuccess({ uploadMultiFile }) {
    const photos = [];
    uploadMultiFile.files.forEach((file) => {
      photos.push(file.url);
    });

    this.setState({
      photos,
      isSubmit: false,
    });
  }

  onUploadClick() {
    this.state.inputUpload.click();
  }

  onChange = (editorState) => {
    this.setState(prevState => ({
      ...prevState,
      editorState,
      isSubmit: !editorState.getCurrentContent().getPlainText().trim(),
    }));
  }

  onSubmit = () => {
    const data = JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent()));
    const { friend } = this.props;
    const { photos } = this.state;
    if (friend) {
      this.props.createNewPost(data, this.privacy.getCurrentValue(), photos, friend);
    } else {
      this.props.createNewPost(data, this.privacy.getCurrentValue(), photos);
    }
    this.setState(prevState => ({
      ...prevState,
      editorState: EditorState.createEmpty(compositeDecorator),
      isSubmit: true,
      photos: [],
    }));
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

  onDeleteImage = (index) => {
    const { photos } = this.state;
    photos.splice(index, 1);
    this.setState({
      photos,
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

  focus = () => this.editor.focus();

  render() {
    const { editorState, isSubmit, photos, error } = this.state;
    const { displayPrivacy } = this.props;
    return (
      <div className={s.newPostPanel}>
        <Col className={s.newPostEditor}>
          <div
            style={styles.editor}
            onClick={this.focus}
            title="Nội dung bài viết, chia sẻ hoặc cập nhật trạng thái của bạn"
          >
            <Editor
              editorState={editorState}
              onChange={this.onChange}
              placeholder="Chia sẻ bài viết, ảnh hoặc cập nhật"
              ref={(editor) => { this.editor = editor; }}
              spellCheck
            />
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
            {error.length > 0 ? <span className={s.errorText}>{error}</span> : null}
          </div>
        </Col>
        <Col className={s.newPostControl}>
          <Col className="pull-left">
            <Button
              bsStyle="link"
              className={s.addPhoto}
              title="Đính kèm ảnh"
              onClick={this.onUploadClick}
            >
              <i className="fa fa-camera fa-lg" aria-hidden="true"></i>&nbsp;
              <strong>Ảnh</strong>
              <MultipleUploadFile inputRef={input => this.state.inputUpload = input} onSuccess={this.onUploadSuccess} className="hide" />
            </Button>
          </Col>
          <Col className="pull-right" style={{ marginRight: '15px' }}>
            {displayPrivacy && <Privacy
              className={s.privacyOptions}
              PUBLIC={this.props.PUBLIC}
              FRIEND={this.props.FRIEND}
              ONLY_ME={this.props.ONLY_ME}
              ADMIN_BUILDING={this.props.ADMIN_BUILDING}
              ref={privacy => this.privacy = privacy}
            />}
            <Button title="Đăng bài" bsStyle="primary" onClick={this.onSubmit} disabled={isSubmit}>Đăng bài</Button>
          </Col>

          <Clearfix />
        </Col>
      </div>
    );
  }
}

const doNothing = (e) => {
  if (e) e.preventDefault();
};

NewPost.propTypes = {
  createNewPost: PropTypes.func.isRequired,
  friend: PropTypes.object,
  displayPrivacy: PropTypes.bool,
  PUBLIC: PropTypes.bool.isRequired,
  FRIEND: PropTypes.bool.isRequired,
  ONLY_ME: PropTypes.bool.isRequired,
  ADMIN_BUILDING: PropTypes.bool.isRequired,
};

NewPost.defaultProps = {
  createNewPost: doNothing,
  displayPrivacy: true,
  PUBLIC: true,
  FRIEND: true,
  ONLY_ME: true,
  ADMIN_BUILDING: false,
};

NewPost.fragments = {};
NewPost.mutation = {
  createNewPost: gql`mutation createNewPost ($message: String!, $userId: String, $privacy: PrivacyType, $photos: [String]) {
    createNewPost(message: $message, userId: $userId, privacy: $privacy, photos: $photos) {
      ...PostView
    }
  }
  ${Feed.fragments.post}
  `,
};

export default withStyles(s)(NewPost);
