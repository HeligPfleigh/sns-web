import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Editor, EditorState, getDefaultKeyBinding } from 'draft-js';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { stateToHTML } from 'draft-js-export-html';
import s from './ChatEditor.scss';

class ChatEditor extends Component {
  static propTypes = {
    handleAction: PropTypes.func.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = { editorState: EditorState.createEmpty() };
    this.onChange = editorState => this.setState({ editorState });
  }

  keyBindingFn = (e) => {
    if (e.keyCode === 13) {
      return 'send-message';
    }
    return getDefaultKeyBinding(e);
  }
  handleKeyCommand = (command) => {
    const { editorState } = this.state;
    if (command === 'send-message') {
      if (editorState.getCurrentContent().getPlainText().trim()) {
        this.props.handleAction(stateToHTML(editorState.getCurrentContent()));
        this.setState({ editorState: EditorState.createEmpty() });
      }
    }
  }
  render() {
    return (
      <Editor
        editorState={this.state.editorState}
        onChange={this.onChange}
        ref={(editor) => { this.editor = editor; }}
        spellCheck
        handleKeyCommand={this.handleKeyCommand}
        keyBindingFn={this.keyBindingFn}
        placeholder="Nội dung trò chuyện..."
      />
    );
  }
}
export default withStyles(s)(ChatEditor);
