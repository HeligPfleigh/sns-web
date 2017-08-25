import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Editor,
  EditorState,
  CompositeDecorator,
  convertToRaw,
  convertFromRaw,
} from 'draft-js';
import classNames from 'classnames';

import {
  HANDLE_REGEX,
  HASHTAG_REGEX,
} from '../../constants';
import HandleSpan from '../Common/Editor/HandleSpan';
import HashtagSpan from '../Common/Editor/HashtagSpan';

function findWithRegex(regex, context, callback) {
  const text = context.getText();
  let matchArr = regex.exec(text);
  while (matchArr !== null) {
    const start = matchArr.index;
    callback(start, start + matchArr[0].length);
    matchArr = regex.exec(text);
  }
}

function handleStrategy(context, callback) {
  findWithRegex(HANDLE_REGEX, context, callback);
}

function hashtagStrategy(context, callback) {
  findWithRegex(HASHTAG_REGEX, context, callback);
}

const compositeDecorator = new CompositeDecorator([{
  strategy: handleStrategy,
  component: HandleSpan,
},
{
  strategy: hashtagStrategy,
  component: HashtagSpan,
}]);

export function createEditorState(value = null) {
  let editorState = EditorState.createEmpty(compositeDecorator);
  if (value) {
    if (value instanceof EditorState) {
      editorState = value;
    } else {
      editorState = EditorState.createWithContent(convertFromRaw(JSON.parse(value)));
    }
      // editorState = EditorState.moveFocusToEnd(editorState);
  }

  return editorState;
}

export default class DraftEditor extends Component {
  constructor(props) {
    super(props);

    this.reset(props);
    this.onChange = this.onChange.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onClick = this.onClick.bind(this);
    this.getCurrentContent = this.getCurrentContent.bind(this);
    this.inputRef = this.inputRef.bind(this);
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
    this.setState({ editorState });

    this.props.onChange.call(this, editorState);
  }

  getCurrentContent() {
    return JSON.stringify(convertToRaw(this.props.editorState.getCurrentContent()));
  }

  reset(props) {
    this.state = {
      hasFocusEditor: false,
    };

    if (!(this.props.editorState instanceof EditorState)) {
      this.state.editorState = createEditorState(props.value);
    }
  }

  inputRef(editor) {
    this.editor = editor;
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
  editorState: PropTypes.object.isRequired,
};

DraftEditor.defaultProps = {
  onFocus: () => undefined,
  onBlur: () => undefined,
  onClick: () => undefined,
  onChange: () => undefined,
  editorState: {
  },
};
