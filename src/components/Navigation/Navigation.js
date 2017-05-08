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
import { Dropdown, MenuItem } from 'react-bootstrap';
import MediaQuery from 'react-responsive';
import { connect } from 'react-redux';
import _ from 'lodash';
import s from './Navigation.scss';
import Link from '../Link';
import { makeNotificationRead } from '../../actions/chat';
import CustomToggle from '../Common/DropdownMenu/CustomToggle';
import history from '../../core/history';
import NotificationList from '../Notification/NotificationList';

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
    user: React.PropTypes.object,
    data: React.PropTypes.object,
    loadMoreRows: React.PropTypes.func,
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

  navEventHandler = (path) => {
    history.push(path);
  };

  render() {
    const {
      isMobile,
      chatNotification,
      current,
      user,
      user: { totalNotification },
      data: { loading, edges, pageInfo },
      loadMoreRows,
    } = this.props;

    let hasNextPage = false;
    if (!loading && pageInfo) {
      hasNextPage = pageInfo.hasNextPage;
    }
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

        <MediaQuery query="(max-width: 992px)">
          <Link className={s.link} to="/notifications">
            {
              totalNotification > 0 &&
              <i className="fa fa-bell-o" data-badge={totalNotification}></i>
            }

            {
              totalNotification < 1 &&
              <i className="fa fa-bell"></i>
            }
          </Link>
        </MediaQuery>

        <MediaQuery query="(min-width: 992px)">
          <Dropdown className={s.link} id="dropdown-notification" componentClass="div" pullRight>
            <CustomToggle bsRole="toggle">
              {
                totalNotification > 0 &&
                <i className="fa fa-bell-o" data-badge={totalNotification}></i>
              }

              {
                totalNotification < 1 &&
                <i className="fa fa-bell"></i>
              }
              <span>Thông báo</span>
            </CustomToggle>
            <Dropdown.Menu className={s.dropdownNotiPanel}>
              <MenuItem header className={s.headerItem}>Thông báo</MenuItem>
              { edges && <NotificationList notifications={edges} userInfo={user} /> }
              <MenuItem className={s.showAllItem} href="/notifications">
                Xem toàn bộ thông báo
              </MenuItem>
            </Dropdown.Menu>
          </Dropdown>
        </MediaQuery>
      </div>
    );
  }
}

export default withStyles(s)(Navigation);
