import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Dropdown, MenuItem } from 'react-bootstrap';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import InfiniteScroll from 'react-infinite-scroll-component';
import Link from '../Link';
import history from '../../core/history';
import { makeNotificationRead } from '../../actions/chat';
import CustomToggle from '../Common/DropdownMenu/CustomToggle';
import NotificationList from '../Notification/NotificationList';
import { FriendActionItem } from './FriendsList';

import s from './Navigation.scss';

const getNotificationCount = (chatNotification, current) => {
  const copyObjectNotification = chatNotification && Object.assign({}, chatNotification);
  if (current && chatNotification && chatNotification[current]) {
    delete copyObjectNotification[current];
  }
  const countChatNotification = !isEmpty(copyObjectNotification) && Object.keys(copyObjectNotification).length;
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
class Navigation extends Component {

  constructor(props) {
    super(props);
    const { friends } = props;
    this.state = {
      friends,
      isOpen: false,
      isOpenGroup: false,
    };
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

  onToggleClick = (isOpenGroup) => {
    this.setState({
      isOpenGroup,
    });
  }

  handleUpdateTitle = () => {
    const { chatNotification, current, user: { totalNotification } } = this.props;
    const countChatNotification = getNotificationCount(chatNotification, current);
    if (document && document.title) {
      const clearTitle =  document.title.replace(/^(\([0-9\-]+\)\s)/ig, ''); //eslint-disable-line
      if (countChatNotification > 0 || totalNotification > 0) {
        const cnt = totalNotification + countChatNotification;
        document.title = `(${cnt}) ${clearTitle}`;
      } else {
        document.title = clearTitle;
      }
    }
  }

  navEventHandler = (path) => {
    this.setState({
      isOpenGroup: false,
    });
    history.push(path);
  };

  dropEventHandler = (isOpen) => {
    const { updateSeen } = this.props;
    if (isOpen) {
      updateSeen();
    }
    this.setState(prevState => ({
      ...prevState,
      isOpen,
    }));
  }

  popupHandler = () => {
    this.setState(prevState => ({
      ...prevState,
      isOpen: !prevState.isOpen,
    }));
  }

  generateDivs = () => {
    const moreDivs = [];
    // let count = this.state.friends.length;
    // for (let i = 0; i < 30; i++) {
    //   moreDivs.push(
    //     <div key={`div${count++}`} style={{ height: 50 }}>
    //       Div no {count}
    //     </div>,
    //   );
    // }
    setTimeout(() => {
      this.setState({ friends: this.state.friends.concat(moreDivs) });
    }, 500);
  }

  render() {
    const {
      isMobile,
      chatNotification,
      current,
      user,
      user: { totalNotification },
      data: { loading, edges, pageInfo },
      loadMoreRows,
      updateIsRead,
      friends,
      rejectFriendAction,
      acceptFriendAction,
    } = this.props;

    const { isOpen, isOpenGroup } = this.state;
    let hasNextPage = false;
    if (!loading && pageInfo) {
      hasNextPage = pageInfo.hasNextPage;
    }
    const countChatNotification = getNotificationCount(chatNotification, current);
    const buildingId = !isEmpty(user) && user.building && user.building._id;

    return (
      <div className={isMobile ? s.navbarSecond : s.navigation} role="navigation">
        <Link title="Trang chủ" className={s.link} to="/">
          <i className="fa fa-home"></i>
          {isMobile ? '' : <span>Trang chủ</span>}
        </Link>
        <div className={s.userDropdown}>
          <Dropdown id="dropdown-custom-1" pullRight onToggle={this.onToggleClick} open={isOpenGroup} >

            <CustomToggle bsRole="toggle" refs="child">
              <Link title="Nhóm" className={s.link} to="#">
                <i className="fa fa-users"></i>
                {isMobile ? '' : <span>Nhóm</span>}
              </Link>
            </CustomToggle>

            <Dropdown.Menu className={s.userDropdownMenu} hidden>
              <div className={s.headerItem}><strong>Bạn bè</strong>
                <a onClick={this.addFriend} hidden>
                  <div className={s.icon}><i className="fa fa-plus" aria-hidden="true" ></i></div>
                </a>
              </div>
              <div className={s.boxListUser}>
                <InfiniteScroll
                  next={this.generateDivs}
                  hasMore
                  loader={<span style={{ display: 'none' }}>Đang tải...</span>}
                  endMessage={<span style={{ display: 'none' }}>Đang tải...</span>}
                >
                  { friends && friends.map(friend =>
                    <FriendActionItem
                      key={`friend-id-${friend._id}`}
                      friend={friend}
                      handleAcceptFriendAction={acceptFriendAction}
                      handleRejectFriendAction={rejectFriendAction}
                    />,
                  )}
                </InfiniteScroll>
              </div>
              <Link title="xem tất cả" to="#" onClick={() => this.navEventHandler('/friends')}>
                <div className={s.bottomItem}>Xem tất cả</div>
              </Link>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <Link title="Tòa nhà" className={s.link} to={`/building/${buildingId}`}>
          <i className="fa fa-building"></i>
          {isMobile ? '' : <span>Tòa nhà</span>}
        </Link>

        <Link title="Tin nhắn" className={s.link} to="/messages">
          {
            countChatNotification > 0 &&
            <i className="fa fa-comment-o" data-badge={countChatNotification}></i>
          }

          {
            countChatNotification < 1 &&
            <i className="fa fa-comment"></i>
          }
          { isMobile ? '' : <span>Tin nhắn</span> }
        </Link>

        <MediaQuery query="(max-width: 992px)">
          <Link title="Thông báo" className={s.link} to="/notifications">
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
          <Dropdown
            title="Thông báo"
            className={s.link} id="dropdown-notification"
            componentClass="div" pullRight onToggle={this.dropEventHandler}
            open={isOpen}
          >
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
              <div className={s.boxNotificationList}>
                <InfiniteScroll
                  height={300}
                  next={loadMoreRows}
                  hasMore={hasNextPage}
                  scrollThreshold={0.7}
                  loader={<span style={{ display: 'none' }}>Loading...</span>}
                  endMessage={<span style={{ display: 'none' }}>Loading...</span>}
                >
                  { edges && <NotificationList
                    notifications={edges}
                    userInfo={user}
                    updateIsRead={updateIsRead}
                    hidePopup={this.popupHandler}
                    isHeader
                  /> }
                </InfiniteScroll>
              </div>
              <MenuItem
                title="Xem toàn bộ thông báo"
                className={s.showAllItem}
                onClick={() => this.navEventHandler('/notifications')}
              >
                Xem toàn bộ thông báo
              </MenuItem>
            </Dropdown.Menu>
          </Dropdown>
        </MediaQuery>
      </div>
    );
  }
}

Navigation.defaultProps = {
  isMobile: false,
  chatNotification: {},
  location: {},
  current: '',
  user: {},
  data: {},
};

Navigation.propTypes = {
  isMobile: PropTypes.bool,
  chatNotification: PropTypes.object,
  location: PropTypes.object,
  current: PropTypes.string,
  makeNotificationRead: PropTypes.func,
  user: PropTypes.object,
  data: PropTypes.object,
  loadMoreRows: PropTypes.func,
  updateSeen: PropTypes.func.isRequired,
  updateIsRead: PropTypes.func.isRequired,
  rejectFriendAction: PropTypes.func.isRequired,
  acceptFriendAction: PropTypes.func.isRequired,
  friends: PropTypes.array,
};

export default withStyles(s)(Navigation);
