import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'react-apollo';
import { Image } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Menu.scss';
import MenuVertical from '../../../components/MenuVertical';

const menus = [{
  icon: 'fa fa-building',
  text: 'Quản lý mặt bằng',
  key: 'ground_management',
  url: '/ground-management',
}, {
  icon: 'fa fa-address-book',
  text: 'Quản lý cư dân',
  key: 'resident_management',
  url: '/resident/approve_member/list',
  children: [{
    text: 'Phê duyệt',
    key: 'approve_member',
    url: '/resident/approve_member/list',
  }, {
    text: 'Dánh sách cư dân',
    key: 'residents',
    url: '/resident/list',
  }, {
    text: 'Sửa đổi thông tin',
    key: 'change_info',
    // url: '/change_info',
  }],
}, {
  icon: 'fa fa-money',
  text: 'Quản lý chi phí',
  key: 'fee_management',
  url: '/fee/list',
  children: [{
    text: 'Báo cáo',
    key: 'fee_dashboard',
    url: '/fee/list',
  }, {
    text: 'Upload',
    key: 'fee_upload',
    url: '/fee/upload',
  }, {
    text: 'Thông báo phí',
    key: 'fee_notications',
    // url: '/fee/notication',
  }],
}, {
  icon: 'fa fa-bullhorn',
  text: 'Quản lý thông báo',
  key: 'announcements_management',
  url: '/announcement/list',
  children: [{
    text: 'Các thông báo',
    key: 'announcements',
    url: '/announcement/list',
  }, {
    text: 'Tạo thông báo',
    key: 'create_announcement',
    url: '/announcement/create',
  }],
}, {
  icon: 'fa fa-cog',
  text: 'Cài đặt',
  key: 'settings.general',
  // url: '/settings',
  children: [{
    text: 'Phí - Hóa Đơn',
    key: 'settings.fee',
    url: '/settings/fee',
  }],
}];

class Menu extends Component {

  onMenuSelected = () => {
  }

  render() {
    const { parentPath, pageKey, user } = this.props;
    return (
      <div className={s.menuLeftClass}>
        <div className={s.inforManager}>
          <Image
            style={{ margin: '8px' }}
            src={user && user.profile && user.profile.picture}
            circle width={45} height={45}
          />
          <div className={s.userInfo}>
            <h5>{`${user.profile.firstName} ${user.profile.lastName}`}</h5>
            <span>Ban quản lý</span>
          </div>
        </div>
        <MenuVertical parentPath={parentPath} pageKey={pageKey} menus={menus} />
      </div>
    );
  }
}

Menu.propTypes = {
  user: PropTypes.object.isRequired,
  parentPath: PropTypes.string.isRequired,
  pageKey: PropTypes.string.isRequired,
};

export default compose(
  withStyles(s),
)(Menu);

