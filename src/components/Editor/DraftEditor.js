import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Editor,
  EditorState,
  CompositeDecorator,
  convertFromRaw,
  convertFromHTML,
  ContentState,
  convertToRaw,
} from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import classNames from 'classnames';
import isUndefined from 'lodash/isUndefined';
import isNull from 'lodash/isNull';
import isObject from 'lodash/isObject';
import isFunction from 'lodash/isFunction';

import HandleSpan from './HandleSpan';
import HashtagSpan from './HashtagSpan';

export const HANDLE_REGEX = /@[\w\d]+/g;
export const HASHTAG_REGEX = /#[\w\d]+/g;

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

export function createContentState(value) {
  if (value instanceof EditorState) {
    return value.getCurrentContent();
  }

  if (value instanceof ContentState) {
    return value;
  }

  if (isUndefined(value) || isNull(value)) {
    return ContentState.createFromText('');
  }

  let jsonValue = null;
  try {
    jsonValue = JSON.parse(value);
  } catch (e) {

  }

  try {
    if (jsonValue) {
      return convertFromRaw(jsonValue);
    }
    const blocksFromHTML = convertFromHTML(value);
    return ContentState.createFromBlockArray(
          blocksFromHTML.contentBlocks,
          blocksFromHTML.entityMap,
      );
  } catch (e) {
    return ContentState.createFromText('');
  }
}

export function createEditorState(value) {
  if (value instanceof EditorState) {
    return value;
  }

  if (isUndefined(value) || isNull(value)) {
    return EditorState.createEmpty(compositeDecorator);
  }

  try {
    return EditorState.createWithContent(createContentState(value));
  } catch (e) {
    return EditorState.createEmpty(compositeDecorator);
  }
}

export function DraftToHTML(value) {
  return stateToHTML(createContentState(value));
}

export default class DraftEditor extends Component {
  constructor(props, ...args) {
    super(props, ...args);

    this.__init(props);

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

    if (isFunction(this.callback.onFocus)) {
      this.callback.onFocus.apply(this, ...args);
    }
  }

  onBlur(...args) {
    this.setState({
      hasFocusEditor: false,
    });

    if (isFunction(this.callback.onBlur)) {
      this.callback.onBlur.apply(this, ...args);
    }
  }

  onClick(...args) {
    this.editor.focus();

    if (isFunction(this.callback.onClick)) {
      this.callback.onClick.apply(this, ...args);
    }
  }

  onChange(editorState) {
    this.setState({
      editorState,
    });

    if (this.input.onChange) {
      let currentValue = null;
      if (editorState.getCurrentContent().hasText()) {
        currentValue = JSON.stringify(convertToRaw(editorState.getCurrentContent()));
      }

      this.input.onChange(currentValue);
    }

    if (isFunction(this.callback.onChange)) {
      this.callback.onChange.call(this, editorState);
    }
  }

  getCurrentContent() {
    return JSON.stringify(this.state.editorState.toJS());
  }

  __init(props) {
    this.input = isUndefined(props.input) || !isObject(props.input) ? {} : props.input;
    this.callback = isUndefined(props.callback) || !isObject(props.callback) ? {} : props.callback;
    this.state = {
      hasFocusEditor: false,
      editorState: createEditorState(this.input.value),
    };
  }

  inputRef(editor) {
    this.editor = editor;
  }

  render() {
    const { input: { onChange, editorState, ...input }, meta, className, ...props } = this.props;
    return (
      <div
        className={classNames('form-control', className, { focus: this.state.hasFocusEditor })}
        onClick={this.onClick}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        style={{ height: 'auto' }}
      >
        <Editor
          editorState={this.state.editorState}
          onChange={this.onChange}
          ref={this.inputRef}
          {...input}
          {...props}
        />
      </div>
    );
  }
}

DraftEditor.propTypes = {
  input: PropTypes.shape({
    onChange: PropTypes.func,
    editorState: PropTypes.instanceOf(EditorState),
  }),
  meta: PropTypes.object,
  callback: PropTypes.shape({
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onClick: PropTypes.func,
    onChange: PropTypes.func,
  }),
  className: PropTypes.string,
};

DraftEditor.defaultProps = {
  spellCheck: false,
  input: {
    onChange: () => undefined,
    editorState: createEditorState(null),
  },
};
