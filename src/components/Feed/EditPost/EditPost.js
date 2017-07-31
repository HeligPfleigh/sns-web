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
import isEmpty from 'lodash/isEmpty';
import SharingPost from '../SharingPost';
import s from './EditPost.scss';

const styles = {
  editor: {
    // border: '1px solid #ddd',
    cursor: 'text',
    minHeight: 40,
    fontSize: '14px',
    padding: '10px 0px',
  },
};

class EditPost extends Component {
  constructor(props) {
    super(props);
    const { data: { message } } = this.props;
    let editorState = null;
    if (message) {
      const contentState = convertFromRaw(JSON.parse(message));
      // move focus to the end.
      editorState = EditorState.createWithContent(contentState);
      editorState = EditorState.moveFocusToEnd(editorState);
    }
    this.state = {
      editorState: editorState || EditorState.createEmpty(),
      isSubmit: true,
      isDelPostSharing: true,
    };

    this.onChange = editorStateChange => this.setState({
      editorState: editorStateChange,
      isSubmit: !editorStateChange.getCurrentContent().getPlainText().trim(),
    });
  }

  onSubmit = (evt) => {
    evt.preventDefault();
    const { data: postData } = this.props;
    const { data: { message } } = this.props;
    const content = JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent()));
    if (content === message) {
      this.props.closeEditPost();
    } else {
      const data = { ...postData, ...{ message: content } };
      this.props.onChange(data, this.state.isDelPostSharing);
    }
  }

  focus = () => this.editor.focus();

  delPostSharing = () => {
    this.setState({
      isDelPostSharing: false,
    });
  }

  render() {
    const { className, sharing } = this.props;
    const { editorState, isSubmit, isDelPostSharing } = this.state;
    const delBlockStyle = {
      position: 'absolute',
      zIndex: 1,
      top: '10px',
      right: '10px',
      cursor: 'pointer',
    };

    return (
      <div className={classNames(s.postContent, className)}>
        <Clearfix />
        <Col>
          <div
            style={styles.editor}
            onClick={this.focus}
            title="Chỉnh sửa bài viết của bạn"
          >
            <Editor
              spellCheck
              placeholder="Bạn đang nghĩ gì?"
              editorState={editorState} onChange={this.onChange}
              ref={(editor) => { this.editor = editor; }}
            />
          </div>
        </Col>
        {sharing && !isEmpty(sharing) && isDelPostSharing &&
          <Col style={{ position: 'relative', marginTop: '-30px' }}>
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
          </Col>
        }
        <Col style={{ borderTop: '1px solid #ddd', paddingTop: '10px' }}>
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
  data: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  closeEditPost: PropTypes.func.isRequired,
  sharing: PropTypes.any,
};

export default withStyles(s)(EditPost);
