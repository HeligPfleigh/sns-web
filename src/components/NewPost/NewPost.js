import React, { PropTypes } from 'react';
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
  FormControl,
} from 'react-bootstrap';

import {
  HANDLE_REGEX,
  HASHTAG_REGEX,
  PUBLIC,
  FRIEND,
  ONLY_ME,
} from '../../constants';
import s from './NewPost.scss';
import HandleSpan from '../Common/Editor/HandleSpan';
import HashtagSpan from '../Common/Editor/HashtagSpan';
import { Feed } from '../Feed';

/**
 * Super simple decorators for handles and hashtags, for demonstration
 * purposes only. Don't reuse these regexes.
 */
const styles = {
  editor: {
    // border: '1px solid #ddd',
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
class NewPost extends React.Component {

  state = {
    editorState: EditorState.createEmpty(compositeDecorator),
    isSubmit: true,
    privacy: PUBLIC,
  };

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
    if (friend) {
      this.props.createNewPost(data, this.state.privacy, friend);
    } else {
      this.props.createNewPost(data, this.state.privacy);
    }
    this.setState(prevState => ({
      ...prevState,
      editorState: EditorState.createEmpty(compositeDecorator),
      isSubmit: true,
      privacy: PUBLIC,
    }));
  }

  onChangePrivacy = (evt) => {
    evt.preventDefault();
    this.setState({
      privacy: evt.target.value,
    });
  }

  focus = () => this.editor.focus();

  render() {
    const { editorState, isSubmit } = this.state;
    const { privacy, displayPrivacy } = this.props;
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
          </div>
        </Col>
        <Col className={s.newPostControl}>
          <Col className="pull-left">
            <Button bsStyle="link" className={s.addPhoto} title="Đính kèm ảnh">
              <i className="fa fa-camera fa-lg" aria-hidden="true"></i>&nbsp;
              <strong>Ảnh</strong>
            </Button>
          </Col>

          <Col className="pull-right">
            <Button title="Đăng bài" bsStyle="primary" onClick={this.onSubmit} disabled={isSubmit}>Đăng bài</Button>
          </Col>
          <Col className="pull-right" style={{ marginRight: '5px' }}>
            {displayPrivacy && <FormControl
              onChange={this.onChangePrivacy}
              defaultValue={privacy[0]}
              componentClass="select"
              title="Ai có thể đọc bài viết của bạn"
            >
              {privacy.map(item => (
                <option key={item} value={item}>{item === 'PUBLIC' ? 'Công khai' : (item === 'FRIEND' ? 'Bạn bè' : 'Chỉ mình tôi')}</option>
              ))}
            </FormControl>}
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
  privacy: PropTypes.array.isRequired,
  friend: PropTypes.object,
  displayPrivacy: PropTypes.bool,
};

NewPost.defaultProps = {
  createNewPost: doNothing,
  privacy: [PUBLIC, FRIEND, ONLY_ME],
  displayPrivacy: true,
};

NewPost.fragments = {};
NewPost.mutation = {
  createNewPost: gql`mutation createNewPost ($message: String!, $userId: String, $privacy: PrivacyType) {
    createNewPost(message: $message, userId: $userId, privacy: $privacy) {
      ...PostView
    }
  }
  ${Feed.fragments.post}
  `,
};

export default withStyles(s)(NewPost);
