import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Row,
  Modal,
  Button,
  ButtonToolbar,
  InputGroup,
} from 'react-bootstrap';
import {
  Editor,
  EditorState,
  CompositeDecorator,
  convertToRaw,
} from 'draft-js';
import isEmpty from 'lodash/isEmpty';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import { SHARE_FRIEND, HANDLE_REGEX, HASHTAG_REGEX } from '../../constants';
import HandleSpan from '../../components/Common/Editor/HandleSpan';
import HashtagSpan from '../../components/Common/Editor/HashtagSpan';
import Feed from '../../components/Feed/Feed';
import UserSelect from '../../components/UserSelect';
import { Privacy } from '../Dropdown';
import s from './Feed.scss';

/**
 * Super simple decorators for handles and hashtags, for demonstration
 * purposes only. Don't reuse these regexes.
 */
const styles = {
  editor: {
    border: '0px solid #ddd',
    cursor: 'text',
    minHeight: 60,
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

  /**
   *
   */
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(compositeDecorator),
      isSubmit: false,
    };
  }

  /**
   *
   */
  componentWillReceiveProps(nextProps) {
    const { isFocus } = this.props;
    if (nextProps.isFocus !== isFocus) {
      this.editor.focus();
    }
  }

  /**
   *
   */
  onChange = (editorState) => {
    this.setState({
      editorState,
      isSubmit: !!editorState.getCurrentContent().getPlainText().trim(),
    });
  }

  /**
   *
   */
  onSubmit = (evt) => {
    const message = JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent()));
    const { friend } = this.state;
    this.props.clickModal(evt, {
      message,
      privacyPost: this.privacy.getCurrentValue(),
      userId: friend && friend._id,
    });

    // reset editor
    this.editor.blur();

    this.setState({
      editorState: EditorState.createEmpty(compositeDecorator),
      isSubmit: false,
    });
  }

  /**
   *
   */
  focus = () => this.editor.focus();

  /**
   *
   */
  logChange = (val) => {
    this.setState({ friend: val });
  }

  closeModal = () => {
    const { closeModal } = this.props;
    this.setState({
      editorState: EditorState.createEmpty(compositeDecorator),
      isSubmit: false,
      friend: undefined,
    });
    closeModal();
  }

  /**
   *
   */
  showButtonToolbar() {
    const { shareType } = this.props;
    return (
      <ButtonToolbar className="pull-right">
        <Privacy className={s.sharingPostModalButtonPrivacies} ref={privacy => this.privacy = privacy} />

        <Button onClick={this.closeModal}>Hủy</Button>
        <Button bsStyle="primary" onClick={this.onSubmit} disabled={(shareType === SHARE_FRIEND) && isEmpty(this.state.friend)}>Chia sẻ bài viết</Button>
      </ButtonToolbar>
    );
  }

  /**
   *
   */
  render() {
    const { shareType, friends, sharingFeed, show } = this.props;

    return (
      <Modal show={show} onHide={this.closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Chia sẻ bài viết</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          { (shareType === SHARE_FRIEND) && <Row style={{ marginBottom: '10px' }}>
            <InputGroup>
              <InputGroup.Addon style={{ borderRadius: 0 }}>
                Bạn bè
              </InputGroup.Addon>
              <UserSelect
                style={{ borderRadius: 0 }}
                name="user-select"
                value={this.state.friend || undefined}
                options={friends}
                onChange={this.logChange}
                clearable={!isEmpty(this.state.friend)}
                valueKey="_id"
                labelKey="fullName"
              />
            </InputGroup>
          </Row> }
          <div style={styles.editor} onClick={this.focus}>
            <Editor
              editorState={this.state.editorState}
              onChange={this.onChange}
              // eslint-disable-next-line
              ref={editor => (this.editor = editor)}
              placeholder="Nói gì đó về nó..."
              spellCheck
            />
          </div>
          <Feed
            data={sharingFeed}
            sharingPostModalOpenned
          />
        </Modal.Body>
        <Modal.Footer>
          { this.showButtonToolbar() }
        </Modal.Footer>
      </Modal>
    );
  }
}

SharingPostModal.propTypes = {
  show: PropTypes.bool,
  closeModal: PropTypes.func,
  clickModal: PropTypes.func,
  sharingFeed: PropTypes.object.isRequired,
  isFocus: PropTypes.bool,
  shareType: PropTypes.string,
  friends: PropTypes.array,
};

export default withStyles(s)(SharingPostModal);
