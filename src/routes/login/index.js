/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';

const title = 'Đăng nhập';

export default {

  path: '/login',

  async action({ store }) {
    const state = store.getState();
    if (state.user) {
      return { redirect: '/' };
    }
    const Login = await require.ensure([], require => require('./Login').default, 'login');

    return {
      title,
      component: <Login title={title} />,
    };
  },

};
