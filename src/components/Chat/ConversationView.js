import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';

import { Scrollbars } from 'react-custom-scrollbars';
import s from './Conversation.scss';
import ChatEditor from './ChatEditor';
import Message from './Message';
import NewMessage from './NewMessage';
import { sendMessage, loadMessageHistory } from '../../actions/chat';
import { formatStatus } from '../../utils/time';

@connect(
  state => ({
    chatState: state.chat,
  }),
  { sendMessage, loadMessageHistory },
)
class ConversationView extends Component {
  static propTypes = {
    chatState: PropTypes.object,
    sendMessage: PropTypes.func.isRequired,
    loadMessageHistory: PropTypes.func.isRequired,
    handleToggleChatView: PropTypes.func.isRequired,
  };
  constructor() {
    super();
    this.state = {
      distyScroll: false,
    };
  }

  componentDidUpdate() {
    const { distyScroll } = this.state;
    if (!distyScroll) {
      this.scrollMessages.scrollTop(this.scrollMessages.getScrollHeight());
    }
  }
  handleSend = (message) => {
    const { chatState } = this.props;
    const { newChat, current } = chatState;
    if (newChat.active && newChat.receiver) {
      this.props.sendMessage({ to: newChat.receiver, message });
    } else if (current) {
      this.props.sendMessage({ message, conversationId: current });
    }
  }
  handleScrollFrame = ({ top }) => {
    const { chatState: { current } } = this.props;
    const { distyScroll } = this.state;
    if (!distyScroll) {
      this.setState({
        distyScroll: true,
      });
    }
    if (current && top === 0) {
      this.props.loadMessageHistory({ conversationId: current });
    }
  }
  render() {
    const { chatState: { user, current, conversations, messages, newChat, online } } = this.props;
    const activeConversation = _.find(conversations, o => _.has(o, current));
    let receiver = activeConversation && Object.values(activeConversation)[0] && Object.values(activeConversation)[0].receiver;
    const members = [user, receiver];
    const messagesOnChat = messages && messages[current];
    const days = [];

    if (!receiver) {
      receiver = newChat && newChat.receiver;
    }
    const statusOnline = online && receiver && receiver.uid && online[receiver.uid];
    return (
      <div className={s.viewChat}>
        <div className={s.chatHeader}>
          <div className={s.navigationMb}>
            <i className="fa fa-arrow-left" aria-hidden="true" onClick={() => this.props.handleToggleChatView()}></i>
            {
              receiver ? <div>
                {
                  statusOnline === true &&
                  <span className={s.online} />
                }
                <span>{`${receiver.profile.firstName} ${receiver.profile.lastName}`}</span>
                {
                  statusOnline !== true &&
                  <span className={s.offline}>
                    {formatStatus(statusOnline)}
                  </span>
                }
              </div>
              : <span>Hội thoại mới</span>
            }
          </div>
          {
            !current && newChat && newChat.active && !newChat.receiver &&
            <NewMessage />
          }
          {
            receiver &&
            <div className={s.chatStatus}>
              <div>
                {
                  statusOnline === true &&
                  <span className={s.online} />
                }
                <span>{`${receiver.profile.firstName} ${receiver.profile.lastName}`}</span>
                {
                  statusOnline !== true &&
                  <span className={s.offline}>
                    {formatStatus(statusOnline)}
                  </span>
                }
              </div>
            </div>
          }
        </div>
        <div className={s.messagesList}>
          <Scrollbars
            style={{ height: '100vh' }}
            universal
            autoHide
            onScrollFrame={this.handleScrollFrame}
            ref={(node) => { this.scrollMessages = node; }}
          >
            {
              messagesOnChat && messagesOnChat.map((message) => {
                let isShowDate = false;
                const messageObj = Object.values(message)[0];
                const { timestamp } = messageObj;
                if (timestamp && days.indexOf(moment(timestamp).format('DD/MM/YYYY')) === -1) {
                  days.push(moment(timestamp).format('DD/MM/YYYY'));
                  isShowDate = true;
                }
                return (<Message key={Object.keys(message)[0]} members={members} message={message} isShowDate={isShowDate} />);
              })
            }
          </Scrollbars>
        </div>
        <div title="Nội dung tin nhắn" className={s.editor}>
          <ChatEditor handleAction={this.handleSend} />
        </div>
      </div>
    );
  }
}

export default withStyles(s)(ConversationView);
