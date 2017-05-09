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
import { Image, Dropdown, MenuItem } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroll-component';
import CustomToggle from '../Common/DropdownMenu/CustomToggle';
import _ from 'lodash';
import s from './Navigation.scss';
import Link from '../Link';
import { makeNotificationRead } from '../../actions/chat';
import FriendDropDown from '../FriendDropDown';

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
  constructor() {
    super();
    const divs = [
      <div key={1} style={{ height: 50, background: '#9bc95b' }}>Div no 1</div>,
      <div key={2} style={{ height: 50, background: '#ffd47b' }}>Div no 2</div>,
      <div key={3} style={{ height: 50, background: '#95a9d6' }}>Div no 3</div>,
      <div key={4} style={{ height: 50, background: '#ffa8e1' }}>Div no 4</div>,
      <div key={5} style={{ height: 50, background: '#ffa8e1' }}>Div no 4</div>,
      <div key={6} style={{ height: 50, background: '#ffa8e1' }}>Div no 4</div>,

      <div key={7} style={{ height: 50, background: '#ffa8e1' }}>Div no 4</div>,
      <div key={8} style={{ height: 50, background: '#ffa8e1' }}>Div no 4</div>,

    ];
    this.state = { divs };
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
  generateDivs = () => {
    const moreDivs = [];
    let count = this.state.divs.length;
    for (let i = 0; i < 30; i++) {
      moreDivs.push(
        <div key={`div${count++}`} style={{ height: 50 }}>
          Div no {count}
        </div>,
      );
    }
    setTimeout(() => {
      this.setState({ divs: this.state.divs.concat(moreDivs) });
    }, 500);
  }
  render() {
    const testArray = ['aaa', 'bbb', 'ccc', 'ddd', 'eee', 'ggg'];
    const { isMobile, chatNotification, current } = this.props;
    const countChatNotification = getNotificationCount(chatNotification, current);
    return (
      <div className={isMobile ? s.navbarSecond : s.navigation} role="navigation">
        <Link className={s.link} to="/">
          <i className="fa fa-home"></i>
          {isMobile ? '' : <span>Trang chủ</span>}
        </Link>
        <div className={s.userDropdown}>
          <Dropdown id="dropdown-custom-1" pullRight>

            <CustomToggle bsRole="toggle">
              <Link className={s.link} to="/friends">

                <i className="fa fa-users"></i>

                {isMobile ? '' : <span>Nhóm</span>}
              </Link>
            </CustomToggle>

            <Dropdown.Menu className={s.userDropdownMenu}>
              <MenuItem header className={s.headerItem}>Bạn bè</MenuItem>
              <MenuItem>
                <InfiniteScroll
                  next={this.generateDivs}
                  hasMore
                  height={300}
                  loader={<h4>Loading...</h4>}
                >
                  {testArray.map(value => <FriendDropDown userName={value} />)}
                 {/*// {this.state.divs}*/}
                </InfiniteScroll>
              </MenuItem>
              <MenuItem >See All</MenuItem>

            </Dropdown.Menu>
          </Dropdown>
        </div>

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
