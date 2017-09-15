/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import isEmpty from 'lodash/isEmpty';

const title = 'Thông báo lỗi đăng nhập ứng dụng';

const messageFunc = {
  0: 'Tài khoản đang chờ kích hoạt',
  // 1: 'Tài khoản đã được kích hoạt',
  2: 'Tài khoản đang tạm ngưng hoạt động',
  3: 'Tài khoản đang bị khóa',
  email: 'Địa chỉ email của tài khoản chưa được xác nhận',
  approval: 'Tài khoản đang chờ xác nhận của tòa nhà',
  'not-active': 'Tài khoản chưa được kích hoạt',
};

export default {
  path: '/waiting',

  async action({ store, query }) {
    const state = store.getState();

    let message = null;
    if (!isEmpty(state.user)) {
      const { user } = state;
      message = messageFunc[user.isActive];
    } else if (!isEmpty(query)) {
      message = messageFunc[query.type];
      if (!message) {
        message = 'Tài khoản đang chờ xác thực';
      }
    } else {
      message = 'Tài khoản đang chờ xác thực';
    }

    if (!message) {
      return { redirect: '/' };
    }

    const Waiting = await require.ensure([], require => require('./Waiting').default, 'waiting');

    return {
      title,
      component: <Waiting title={title} message={message} query={query} />,
    };
  },
};
