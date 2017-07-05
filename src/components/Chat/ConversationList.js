import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { connect } from 'react-redux';
import s from './Conversation.scss';
import ConversationItem from './ConversationItem';
import * as chatActions from '../../actions/chat';
import Loading from '../Loading';

@connect(
  state => ({
    user: state.chat.user,
    newChat: state.chat.newChat,
    current: state.chat.current,
    conversations: state.chat.conversations,
  }),
  { ...chatActions },
)
class ConversationList extends React.Component {
  static propTypes = {
    user: PropTypes.object,
    newChat: PropTypes.object,
    current: PropTypes.string,
    conversations: PropTypes.array,
    activeNewChat: PropTypes.func.isRequired,
    getConversations: PropTypes.func.isRequired,
    activeConversation: PropTypes.func.isRequired,
    handleToggleChatView: PropTypes.func.isRequired,
  }

  constructor() {
    super();
    this.state = {
      searchText: null,
    };
  }

  componentWillMount() {
    const { user, getConversations, current, newChat, activeConversation, conversations } = this.props;
    if (user && user.uid) {
      getConversations();
      if (!current && !newChat.active && conversations && conversations[0]) {
        activeConversation(conversations[0]);
      }
    }
  }
  componentWillReceiveProps(nextProps) {
    const { user, getConversations, activeConversation } = this.props;
    const { conversations, current, newChat } = nextProps;
    if (nextProps.user && nextProps.user !== user) {
      getConversations();
    }
    if (nextProps.user && !current && !newChat.active && conversations && conversations[0]) {
      activeConversation({ conversation: conversations[0] });
    }
  }
  componentWillUnmount() {
    this.props.activeConversation({});
  }

  handleActiveConversation = conversation => () => {
    this.props.handleToggleChatView();
    this.props.activeConversation(conversation);
  }

  handleActiveNewChat = () => {
    this.props.handleToggleChatView();
    this.props.activeNewChat(true);
  }

  handleChangeSearch = (e) => {
    this.setState({
      searchText: e.target.value,
    });
  }

  render() {
    const { newChat, conversations, current, user } = this.props;
    const { searchText } = this.state;
    return (
      <div className={s.conversations}>
        <div className={s.header}>
          <span>
            <i className="fa fa-sliders" />
          </span>
          <span>Tin nhắn</span>
          <span>
            <i className="fa fa-pencil-square-o" onClick={this.handleActiveNewChat} />
          </span>
        </div>
        <div className={s.search}>
          <span>
            <label htmlFor="search">
              <input className={s.searchInput} id="search" placeholder="Tìm kiếm" ref={(node) => { this.input = node; }} onChange={this.handleChangeSearch} />
            </label>
          </span>
        </div>
        <div className={s.listConversation}>
          <Loading show={!user} />
          {
            newChat && newChat.active &&
            <ConversationItem conversation={newChat} active />
          }
          {
            conversations && conversations.filter(conversation =>
              searchText == null ||
              conversation.receiver.profile.firstName.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
                  || conversation.receiver.profile.lastName.toLowerCase().indexOf(searchText.toLowerCase()) !== -1)
                  .map(conversation =>
                    <ConversationItem
                      key={Object.keys(conversation)[0]}
                      onClick={this.handleActiveConversation({ conversation })}
                      conversation={conversation}
                      active={Object.keys(conversation)[0] === current}
                    />,
            )
          }
        </div>
      </div>
    );
  }
}

export default withStyles(s)(ConversationList);
