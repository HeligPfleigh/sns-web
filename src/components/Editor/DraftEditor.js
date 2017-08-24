import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Editor,
  EditorState,
  CompositeDecorator,
  convertToRaw,
} from 'draft-js';
import classNames from 'classnames';

import {
  HANDLE_REGEX,
  HASHTAG_REGEX,
} from '../../constants';
import HandleSpan from '../Common/Editor/HandleSpan';
import HashtagSpan from '../Common/Editor/HashtagSpan';

export default class DraftEditor extends Component {
  constructor(...args) {
    super(...args);

    this.compositeDecorator = new CompositeDecorator([{
      strategy: this.handleStrategy.bind(this),
      component: HandleSpan,
    },
    {
      strategy: this.hashtagStrategy.bind(this),
      component: HashtagSpan,
    }]);

    this.editor = null;

    this.reset();
    this.onChange = this.onChange.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onClick = this.onClick.bind(this);
    this.getCurrentContent = this.getCurrentContent.bind(this);
    this.inputRef = this.inputRef.bind(this);
  }

  findWithRegex(regex, context, callback) {
    const text = context.getText();
    let matchArr = regex.exec(text);
    while (matchArr !== null) {
      const start = matchArr.index;
      callback(start, start + matchArr[0].length);
      matchArr = regex.exec(text);
    }
  }

  handleStrategy(context, callback) {
    this.findWithRegex(HANDLE_REGEX, context, callback);
  }

  hashtagStrategy(context, callback) {
    this.findWithRegex(HASHTAG_REGEX, context, callback);
  }

  inputRef(editor) {
    this.editor = editor;
  }

  onFocus(...args) {
    this.setState({
      hasFocusEditor: true,
    });
    this.props.onFocus.apply(this, ...args);
  }

  onBlur(...args) {
    this.setState({
      hasFocusEditor: false,
    });
    this.props.onBlur.apply(this, ...args);
  }

  onClick(...args) {
    this.editor.focus();
    this.props.onClick.apply(this, ...args);
  }

  onChange(editorState) {
    this.setState(prevState => ({
      ...prevState,
      editorState,
    }));

    this.props.onChange.call(this, editorState);
  }

  reset() {
    this.state = {
      editorState: EditorState.createEmpty(this.compositeDecorator),
      hasFocusEditor: false,
    };
  }

  getCurrentContent() {
    return JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent()));
  }

  render() {
    return (
      <div className={classNames('form-control', this.props.className, { focus: this.state.hasFocusEditor })} onClick={this.onClick} style={{ height: 'auto' }}>
        <Editor
          editorState={this.state.editorState}
          onChange={this.onChange}
          placeholder={this.props.placeholder}
          ref={this.inputRef}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          spellCheck={this.props.spellCheck}
        />
      </div>
    );
  }
}

DraftEditor.propTypes = {
  onFocus: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  spellCheck: PropTypes.bool,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};

DraftEditor.defaultProps = {
  onFocus: () => undefined,
  onBlur: () => undefined,
  onClick: () => undefined,
  onChange: () => undefined,
};
