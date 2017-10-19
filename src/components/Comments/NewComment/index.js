import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Draft, {
  Editor,
  EditorState,
  CompositeDecorator,
  convertToRaw,
} from 'draft-js';
import { connect } from 'react-redux';
import { Image, Col, Clearfix } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import s from './styles.scss';
import HandleSpan from '../../Common/Editor/HandleSpan';
import HashtagSpan from '../../Common/Editor/HashtagSpan';
import { HANDLE_REGEX, HASHTAG_REGEX } from '../../../constants';

/**
 * Super simple decorators for handles and hashtags, for demonstration
 * purposes only. Don't reuse these regexes.
 */
const styles = {
  editor: {
    border: '1px solid #ddd',
    cursor: 'text',
    minHeight: 10,
    padding: 5,
    backgroundColor: '#fff',
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

/** NewComment Component */
@connect(state => ({
  user: state.user,
}))
class NewComment extends Component {

  constructor(props) {
    super(props);
    // const { initContent } = this.props;
    this.state = {
      isSubmit: false,
      editorState: EditorState.createEmpty(compositeDecorator),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isFocus) {
      this.editor.focus();
    }
  }

  onChange = (editorState) => {
    this.setState({
      editorState,
      isSubmit: !!editorState.getCurrentContent().getPlainText().trim(),
    });
  }

  onSubmit = () => {
    const { postId, commentId, user } = this.props;
    const data = JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent()));
    this.props.createNewComment(postId, data, commentId, user);

    // reset editor
    this.editor.blur();
    this.setState({
      editorState: EditorState.createEmpty(compositeDecorator),
      isSubmit: false,
    });
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

  focus = () => this.editor.focus();

  render() {
    const { user } = this.props;
    const { editorState } = this.state;

    return (
      <div className={s.newCommentPanel}>
        <Col className={`pull-left ${s.newCommentAvarta}`}>
          <a title={`${user.profile.firstName} ${user.profile.lastName}`} href="#">
            <Image src={user.profile.picture} circle />
          </a>
        </Col>
        <Col className={`pull-right ${s.newCommentEditor}`}>
          <div style={styles.editor} onClick={this.focus}>
            <Editor
              editorState={editorState}
              onChange={this.onChange}
              keyBindingFn={this._keyBindingFn}
              handleKeyCommand={this._handleKeyCommand}
              placeholder="Viết bình luận"
              ref={(editor) => { this.editor = editor; }}
              spellCheck
            />
          </div>
        </Col>
        <Clearfix />
      </div>
    );
  }
}

NewComment.propTypes = {
  // initContent: PropTypes.string,
  user: PropTypes.object,
  commentId: PropTypes.string,
  // eslint-disable-next-line
  isFocus: PropTypes.bool.isRequired,
  postId: PropTypes.string.isRequired,
  createNewComment: PropTypes.func.isRequired,
};

export default withStyles(s)(NewComment);
