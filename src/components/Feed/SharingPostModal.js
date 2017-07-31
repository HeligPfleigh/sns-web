import React, { Component, PropTypes } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Draft, {
  Editor,
  EditorState,
  CompositeDecorator,
  convertToRaw,
} from 'draft-js';
import { HANDLE_REGEX, HASHTAG_REGEX } from '../../constants';
import HandleSpan from '../../components/Common/Editor/HandleSpan';
import HashtagSpan from '../../components/Common/Editor/HashtagSpan';

/**
 * Super simple decorators for handles and hashtags, for demonstration
 * purposes only. Don't reuse these regexes.
 */
const styles = {
  editor: {
    border: '1px solid #ddd',
    cursor: 'text',
    minHeight: 90,
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

class SharingPostModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(compositeDecorator),
      isSubmit: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { isFocus } = this.props;
    if (nextProps.isFocus !== isFocus) {
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

    this.props.clickModal();

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
    const { editorState, isSubmit } = this.state;

    return (
      <Modal show={this.props.show} onHide={this.props.closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Chia sẻ bài viết</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.closeModal}>Hủy</Button>
          <Button bsStyle="primary" onClick={ this.onSubmit }  disabled={ !isSubmit }>Chia sẻ bài viết</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

SharingPostModal.propTypes = {
  show: PropTypes.bool,
  closeModal: PropTypes.func,
  clickModal: PropTypes.func,
};

export default SharingPostModal;
