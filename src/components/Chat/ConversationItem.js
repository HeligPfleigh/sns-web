import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import classnames from 'classnames';
import formatTime from '../../utils/time';
import Link from '../Link';
import s from './Conversation.scss';

class ConversationItem extends React.Component {
  static propTypes = {
    conversation: PropTypes.object,
    active: PropTypes.bool,
    onClick: PropTypes.func,
  }
  render() {
    let { conversation } = this.props;
    const { active, onClick } = this.props;
    if (!conversation.receiver) {
      conversation = Object.values(conversation)[0];
    }
    const receiver = conversation && conversation.receiver;
    const meta = conversation && conversation.meta;
    const name = receiver && `${receiver.profile.firstName} ${receiver.profile.lastName}`;
    const picture = receiver && receiver.profile && receiver.profile.picture;
    return (
      <div className={classnames(s.conversationItem, { [s.activeNew]: active })}>
        <div className={s.friendAvata}>
          { receiver &&
            <Link to={`/user/${receiver.id}`}>
              <img alt={name} src={picture || '/tile.png'} />
            </Link>
          }
          { !picture && <img alt={name} src={'/tile.png'} /> }
        </div>
        <div onClick={onClick} className={s.friendInfo}>
          <div className={s.friendName}>
            <span>{name || 'Hội thoại mới'}</span>
            {
              meta && meta.lastMessage &&
              <span dangerouslySetInnerHTML={{ __html: `${meta.lastMessage.substring(0, 30).replace(/<(?:.|\n)*?>/gm, '')}...` }} />
            }
          </div>
          {
            meta && meta.timestamp &&
            <div className={s.lastTime}>
              {formatTime(meta.timestamp)}
            </div>
          }
        </div>
      </div>
    );
  }
}

export default withStyles(s)(ConversationItem);
