import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import _ from 'lodash';
import moment from 'moment';
import classnames from 'classnames';
import Link from '../Link';
import s from './Message.scss';

class Message extends React.Component {
  static propTypes = {
    message: PropTypes.object.isRequired,
    members: PropTypes.array.isRequired,
    isShowDate: PropTypes.bool.isRequired,
  };

  render() {
    const { message, members, isShowDate } = this.props;
    const messageValues = Object.values(message)[0];
    const user = _.find(members, o => o.uid === messageValues.user);
    const picture = user && user.profile && user.profile.picture;
    const isOwner = user === members[0];
    return (
      <span>
        {
          isShowDate === true && <div className={s.dateView}>
            <span>{ moment(messageValues && messageValues.timestamp).format('HH:mm DD/MM/YYYY') }</span>
          </div>
        }
        <div className={classnames(s.root, { [s.rootOwner]: isOwner })} >
          <div className={s.chatUser}>
            <Link to={`/user/${user.id}`}>
              <img alt="Xem thông tin" src={picture || '/tile.png'} />
            </Link>
          </div>
          <div className={s.message}>
            <div dangerouslySetInnerHTML={{ __html: messageValues && messageValues.message }} />
          </div>
        </div>
      </span>
    );
  }
}

export default withStyles(s)(Message);
