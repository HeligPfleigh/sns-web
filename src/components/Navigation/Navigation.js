/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { connect } from 'react-redux';
import _ from 'lodash';
import s from './Navigation.scss';
import Link from '../Link';
import { makeNotificationRead } from '../../actions/chat';

const getNotificationCount = (chatNotification, current) => {
  const copyObjectNotification = chatNotification && Object.assign({}, chatNotification);
  if (current && chatNotification && chatNotification[current]) {
    delete copyObjectNotification[current];
  }
  const countChatNotification = !_.isEmpty(copyObjectNotification) && Object.keys(copyObjectNotification).length;
  return countChatNotification;
};

@connect(
  state => ({
    chatNotification: state.chat.notifications,
    current: state.chat.current,
    location: state.runtime && state.runtime.location,
  }),
  { makeNotificationRead },
)
class Navigation extends React.Component {
  static defaultProps = {
    isMobile: false,
  }

  static propTypes = {
    isMobile: React.PropTypes.bool,
    chatNotification: React.PropTypes.object,
    location: React.PropTypes.object,
    current: React.PropTypes.string,
    makeNotificationRead: React.PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.handleUpdateTitle();
  }
  componentWillReceiveProps(nextProps) {
    const { chatNotification, current } = this.props;
    if (current && chatNotification !== nextProps.chatNotification && nextProps.chatNotification && nextProps.chatNotification[current]) {
      this.props.makeNotificationRead({ conversationId: current });
    }
  }
  shouldComponentUpdate(nextProps) {
    const { location } = this.props;
    if (location && location.pathname !== (nextProps.location && nextProps.location.pathname)) return true;
    return true;
  }
  componentDidUpdate() {
    this.handleUpdateTitle();
  }
  handleUpdateTitle = () => {
    const { chatNotification, current } = this.props;
    const countChatNotification = getNotificationCount(chatNotification, current);
    if (document && document.title) {
      const clearTitle =  document.title.replace(/^(\([0-9\-]+\)\s)/ig, ''); //eslint-disable-line
      if (countChatNotification > 0) {
        document.title = `(${countChatNotification}) ${clearTitle}`;
      } else {
        document.title = clearTitle;
      }
    }
  }

  render() {
    const { isMobile, chatNotification, current } = this.props;
    const countChatNotification = getNotificationCount(chatNotification, current);
    return (
      <div className={isMobile ? s.navbarSecond : s.navigation} role="navigation">
        <Link className={s.link} to="/">
          <i className="fa fa-home"></i>
          {isMobile ? '' : <span>Trang chủ</span>}
        </Link>

        <Link className={s.link} to="/friends">
          <i className="fa fa-users"></i>
          {isMobile ? '' : <span>Nhóm</span>}
        </Link>

        <Link className={s.link} to="/messages">
          {
            countChatNotification > 0 &&
            <span className={s.jewelCount}>
              <span>{countChatNotification}</span>
            </span>
          }
          <i className="fa fa-comment"></i>
          {isMobile ? '' : <span>Tinh nhắn</span>}
        </Link>

        <Link className={s.link} to="/contact">
          <i className="fa fa-bell"></i>
          {isMobile ? '' : <span>Thông báo</span>}
        </Link>
      </div>
    );
  }
}

export default withStyles(s)(Navigation);
