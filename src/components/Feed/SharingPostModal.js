import React, { Component, PropTypes } from 'react';
import { Modal, Button, MenuItem, ButtonToolbar, DropdownButton, Dropdown } from 'react-bootstrap';
import Draft, {
  Editor,
  EditorState,
  CompositeDecorator,
  convertToRaw,
} from 'draft-js';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { PUBLIC, FRIEND, ONLY_ME, HANDLE_REGEX, HASHTAG_REGEX } from '../../constants';
import HandleSpan from '../../components/Common/Editor/HandleSpan';
import HashtagSpan from '../../components/Common/Editor/HashtagSpan';
import Feed from '../../components/Feed/Feed';
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
      privacySelected: PUBLIC,
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
  onChange(editorState) {
    this.setState({
      editorState,
      isSubmit: !!editorState.getCurrentContent().getPlainText().trim(),
    });
  }

  /**
   * 
   */
  onSubmit(evt) {
    const message = JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent()));
    this.props.clickModal(evt, {
        message,
        privacyPost: this.state.privacySelected,
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
  _keyBindingFn(e) {
    if (e.keyCode === 13 && !e.altKey) {
      return 'onSubmit';
    }
    return Draft.getDefaultKeyBinding(e);
  }

  /**
   * 
   */
  _handleKeyCommand(command) {
    const { isSubmit } = this.state;
    if (command === 'onSubmit' && isSubmit) {
      this.onSubmit();
    }
    return 'not-handler';
  }

  /**
   * 
   */
  focus() {
    return this.editor.focus();
  }

  /**
   * 
   */
  onSelectPrivacy(privacySelected, event) {
    if ([PUBLIC, FRIEND, ONLY_ME].indexOf(privacySelected) === -1) {
      privacySelected = PUBLIC;
    }
    this.setState({
      privacySelected,
    });
  }

  /**
   * 
   */
  showButtonToolbar() {
    const privacies = {
      PUBLIC: {
        icon: <i className="fa fa-globe" aria-hidden="true"></i>,
        label: 'Công khai',
      },
      FRIEND: {
        icon: <i className="fa fa-users" aria-hidden="true"></i>,
        label: 'Bạn bè',
      },
      ONLY_ME: {
        icon: <i className="fa fa-lock" aria-hidden="true"></i>,
        label: 'Chỉ mình tôi',
      },
    };
    
    const privacyKeys = Object.keys(privacies);
    const keySelected = privacyKeys.indexOf(this.state.privacySelected);
    const selectedKey = keySelected > -1 ? privacyKeys[keySelected] :  PUBLIC;
    const selectedLabel = privacies[selectedKey].label;
    const selectedIcon = privacies[selectedKey].icon;
    delete privacies[selectedKey];

    return (
      <ButtonToolbar className="pull-right">
        <Dropdown className={s.sharingPostModalButtonPrivacies} id={ Math.random() }>
          <Dropdown.Toggle>{ selectedIcon } { selectedLabel }</Dropdown.Toggle>
          <Dropdown.Menu onSelect={ this.onSelectPrivacy.bind(this) }>
              { Object.keys(privacies).map(type => <MenuItem key={ type } eventKey={ type }>{ privacies[type].icon } { privacies[type].label }</MenuItem>) }
          </Dropdown.Menu>
        </Dropdown>

        <Button onClick={ this.props.closeModal.bind(this) }>Hủy</Button>
        <Button bsStyle="primary" onClick={ this.onSubmit.bind(this) }>Chia sẻ bài viết</Button>
      </ButtonToolbar>
    );
  }

  /**
   * 
   */
  render() {
    const { editorState, isSubmit } = this.state;

    return (
      <Modal show={this.props.show} onHide={this.props.closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Chia sẻ bài viết</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={styles.editor} onClick={this.focus.bind(this)}>
            <Editor
              editorState={editorState}
              onChange={this.onChange.bind(this)}
              keyBindingFn={this._keyBindingFn.bind(this)}
              handleKeyCommand={this._handleKeyCommand.bind(this)}
              ref={editor => (this.editor = editor)}
              placeholder="Nói gì đó về nó ..."
              spellCheck
            />
          </div>

          <Feed
            data={this.props.sharingFeed}
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
};

export default withStyles(s)(SharingPostModal);
