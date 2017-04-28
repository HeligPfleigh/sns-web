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
import s from './Navigation.scss';
import Link from '../Link';

class Navigation extends React.Component {
  static defaultProps = {
    isMobile: false,
  }

  static propTypes = {
    isMobile: React.PropTypes.bool,
  }

  render() {
    const { isMobile } = this.props;
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
