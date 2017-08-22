import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Image, Clearfix } from 'react-bootstrap';
import moment from 'moment';
import classNames from 'classnames';

import Link from '../Link';
import s from './FriendOnlineList.scss';

class FriendOnlineItem extends Component {

  onCLick = (evt) => {
    evt.preventDefault();
    const { friend, handleFriendAction } = this.props;
    handleFriendAction(friend._id);
  }

  render() {
    const { friend, isOnline, conversationId } = this.props;
    let conversationIdToRedirect = conversationId;
    if (!conversationId) {
      conversationIdToRedirect = '';
    }
    let status;

    if (typeof (isOnline) === 'boolean') {
      status = <i className={classNames('fa fa-circle', s.iconOnline)} aria-hidden="true"></i>;
    } else if (typeof (isOnline) === 'number') {
      status = moment(isOnline).fromNow();
    } else {
      status = null;
    }

    return (
      <li className={classNames('clearfix')}>
        <Link
          title="T"
          to={`/messages/${conversationIdToRedirect}`}
        >
          <div onClick={this.handleClickFriend}>
            <span className={classNames('pull-left', s.chatImg)}>
              <Image
                alt={friend.profile && friend.profile.fullName}
                src={friend.profile && friend.profile.picture}
                title={friend.profile && `${friend.profile.fullName}`}
                circle
                responsive
              />
            </span>
            <div className={classNames(s.chatBody, 'clearfix')}>
              <strong>{friend.profile.fullName}</strong>
              <span className="pull-right">{status}</span>
            </div>
          </div>
          <Clearfix />
        </Link>
      </li>
    );
  }
}

FriendOnlineItem.propTypes = {
  friend: PropTypes.object.isRequired,
  handleFriendAction: PropTypes.func,
  isOnline: PropTypes.any,
  conversationId: PropTypes.string,
};

export default withStyles(s)(FriendOnlineItem);
