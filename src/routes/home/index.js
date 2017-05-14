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
  path: '/',

  async action({ store }) {
    const redirect = checkAuth(store);
    if (redirect) return redirect;
    const Home = await require.ensure([], require => require('./Home').default, 'home');
    return {
      title: 'SNS - Trang chủ',
      component: <Layout><Home /></Layout>,
    };
  },

};
