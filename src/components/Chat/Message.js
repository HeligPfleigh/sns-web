import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import _ from 'lodash';
import moment from 'moment';
import classnames from 'classnames';
import Link from '../Link';
import s from './Message.scss';

class Message extends Component {
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
      <div>
        <div>
        {
          isShowDate === true && <div className={s.dateView}>
            <span>{ moment(messageValues && messageValues.timestamp).format('HH:mm DD/MM/YYYY') }</span>
          </div>
        }
        </div>
        <div className={classnames(s.root, { [s.rootOwner]: isOwner })} >
          <div className={s.chatUser}>
            <Link to={`/user/${user.id}`}>
              <img alt="Xem thông tin" src={picture || 'avatar-default.jpg'} />
            </Link>
          </div>
          <div className={s.message}>
            <div dangerouslySetInnerHTML={{ __html: messageValues && messageValues.message }} />
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Message);
