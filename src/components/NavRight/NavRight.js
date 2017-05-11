/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Image, Dropdown, MenuItem } from 'react-bootstrap';
import history from '../../core/history';
import Link from '../Link';
import CustomToggle from '../Common/DropdownMenu/CustomToggle';
import s from './NavRight.scss';

class NavRight extends React.Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
  }

  navEventHandler = (path) => {
    history.push(path);
  };

  render() {
    const { user: { profile } } = this.props;
    return (
      <div className={s.navRight}>
        <div className={s.userDropdown}>
          <Dropdown id="dropdown-custom-1" pullRight>
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
                      <strong>{`${profile.firstName} ${profile.lastName}`}</strong>
                      <p>View profile</p>
                    </h2>
                  </div>
                </div>
              </MenuItem>
              <MenuItem header className={s.headerItem}>TÀI KHOẢN</MenuItem>
              <MenuItem onClick={() => this.navEventHandler('/settings')}>Cài đặt</MenuItem>
              <MenuItem onClick={() => this.navEventHandler('/helps')}>Trợ giúp</MenuItem>
              <MenuItem href="/auth/logout">Đăng xuất</MenuItem>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className={s.menuDropdown}>
          <Dropdown id="dropdown-custom-2" pullRight>
            <CustomToggle styles={s.menuToggleBtn} bsRole="toggle">
              <i className="fa fa-bars" aria-hidden="true"></i>
            </CustomToggle>
            <Dropdown.Menu className={s.itemDropdownMenu}>
              <MenuItem eventKey="1">Chung cư của tôi <i className="fa fa-chevron-right pull-right" aria-hidden="true" ></i></MenuItem>
              <MenuItem eventKey="2">Hàng xóm <i className="fa fa-chevron-right pull-right" aria-hidden="true"></i></MenuItem>
              <MenuItem eventKey="3">Nhóm trao đổi <i className="fa fa-chevron-right pull-right" aria-hidden="true"></i></MenuItem>
              <MenuItem eventKey="4">Cửa hàng quanh tôi <i className="fa fa-chevron-right pull-right" aria-hidden="true"></i></MenuItem>
              <MenuItem eventKey="4">Sự kiện sắp tới <i className="fa fa-chevron-right pull-right" aria-hidden="true"></i></MenuItem>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(NavRight);
