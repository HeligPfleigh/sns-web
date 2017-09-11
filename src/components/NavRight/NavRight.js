/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Image, Dropdown, MenuItem } from 'react-bootstrap';
// import classNames from 'classnames';
import history from '../../core/history';
import Link from '../Link';
import CustomToggle from '../Common/DropdownMenu/CustomToggle';
import s from './NavRight.scss';

class NavRight extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
  }

  navEventHandler = (path) => {
    history.push(path);
  };

  render() {
    const { user: { isAdmin, profile } } = this.props;
    return (
      <div className={s.navRight}>
        <div className={s.userDropdown}>
          <Dropdown title="Trang cá nhân" id="dropdown-custom-1" pullRight>
            <Link to="/me">
              <Image src={profile && profile.picture} circle width={32} height={32} />
            </Link>
            <CustomToggle styles={s.userToggleBtn} bsRole="toggle">
              <i className="fa fa-caret-down fa-lg" aria-hidden="true"></i>
            </CustomToggle>
            <Dropdown.Menu className={s.userDropdownMenu}>
              <MenuItem onClick={() => this.navEventHandler('/me')}>
                <div className={s.boxUserItem}>
                  <Image src={profile && profile.picture} circle width={45} height={45} className={s.pullLeft} />
                  <div className={s.name}>
                    <h2>
                      { profile && <strong>{`${profile.firstName} ${profile.lastName}`}</strong> }
                      <p>Hồ sơ</p>
                    </h2>
                  </div>
                </div>
              </MenuItem>
              <MenuItem header className={s.headerItem}>TÀI KHOẢN</MenuItem>
              { /* <MenuItem title="Cài đặt" onClick={() => this.navEventHandler('/settings')}>Cài đặt</MenuItem> */ }
              { /* <MenuItem title="Trợ giúp" onClick={() => this.navEventHandler('/helps')}>Trợ giúp</MenuItem> */ }
              <MenuItem title="Đăng xuất" href="/auth/logout">Đăng xuất</MenuItem>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className={s.menuDropdown}>
          <Dropdown title="Tùy chọn" id="dropdown-custom-2" pullRight>
            <CustomToggle styles={s.menuToggleBtn} bsRole="toggle">
              <i className="fa fa-bars" aria-hidden="true"></i>
            </CustomToggle>
            <Dropdown.Menu className={s.itemDropdownMenu}>
              { isAdmin && <MenuItem title="Trang Quản Lý" eventKey="1" onClick={() => this.navEventHandler('/management')}>
                <span>Quản lý</span>
                <i className="fa fa-chevron-right pull-right" aria-hidden="true" ></i>
              </MenuItem> }
              <MenuItem title="Trang thông báo dành cho bạn" eventKey="1" onClick={() => this.navEventHandler('/announcements')}>
                <span>Thông báo</span>
                <i className="fa fa-chevron-right pull-right" aria-hidden="true" ></i>
              </MenuItem>
              <MenuItem title="Chung cư của tôi" eventKey="1" onClick={() => this.navEventHandler('/my-buildings')}>
                <span>Chung cư</span>
                <i className="fa fa-chevron-right pull-right" aria-hidden="true" ></i>
              </MenuItem>
              <MenuItem title="Căn hộ của tôi" eventKey="1" onClick={() => this.navEventHandler('/apartments')}>
                <span>Căn hộ</span>
                <i className="fa fa-chevron-right pull-right" aria-hidden="true" ></i>
              </MenuItem>
              { /*
                <MenuItem title="Hàng xóm" eventKey="2">
                  Hàng xóm <i className="fa fa-chevron-right pull-right" aria-hidden="true"></i>
                </MenuItem>
                <MenuItem title="Nhóm trao đổi" eventKey="3">
                  Nhóm trao đổi <i className="fa fa-chevron-right pull-right" aria-hidden="true"></i>
                </MenuItem>
                <MenuItem title="Cửa hàng quanh tôi" eventKey="4">
                  Cửa hàng quanh tôi <i className="fa fa-chevron-right pull-right" aria-hidden="true"></i>
                </MenuItem>
              */}
              <MenuItem title="Sự kiện sắp tới" eventKey="5" onClick={() => this.navEventHandler('/events')}>
                Sự kiện sắp tới <i className="fa fa-chevron-right pull-right" aria-hidden="true"></i>
              </MenuItem>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(NavRight);
