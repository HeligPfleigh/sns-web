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

class EditPost extends Component {
  constructor(props) {
    super(props);
    const content = convertFromRaw(JSON.parse(this.props.message));
    this.state = {
      editorState: EditorState.createWithContent(content),
      isSubmit: true,
    };
    this.onChange = editorState => this.setState({
      editorState,
      isSubmit: !editorState.getCurrentContent().getPlainText().trim(),
    });
  }

  onSubmit = (evt) => {
    evt.preventDefault();
    const data = JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent()));
    if (data === this.props.message) {
      this.props.closeEditPost();
    } else {
      this.props.onChange(data);
    }
  }

  render() {
    const { className } = this.props;
    const { editorState, isSubmit } = this.state;
    return (
      <div className={classNames(s.postContent, className)}>
        <Clearfix />
        <Col>
          <div
            title="Chỉnh sửa bài viết của bạn"
          >
            <Editor editorState={editorState} onChange={this.onChange} />
          </div>
        </Col>
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
  message: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  closeEditPost: PropTypes.func.isRequired,
};

export default withStyles(s)(EditPost);
