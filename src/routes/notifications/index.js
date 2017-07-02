/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Layout from '../../components/Layout';
import { checkAuth } from '../../utils/role';

export default {
  path: '/notifications',
  async action({ store }) {
    const redirect = checkAuth(store);
    if (redirect) return redirect;
    const Notifications = await require.ensure([], require => require('./Notifications').default, 'notifications');

    return {
      title: 'SNS - Thông báo người dùng',
      component: <Layout><Notifications /></Layout>,
    };
  },
};
