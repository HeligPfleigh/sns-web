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

export default {

  path: '/forgot-password',

  async action({ store, query }) {
    const state = store.getState();
    if (state.user && !isEmpty(state.user.buildings)) {
      return { redirect: '/' };
    }

    if (!isEmpty(query)) {
      const title = 'Khôi phục mật khẩu đăng nhập';
      const RecoveryPassword = await require.ensure(
        [],
        require => require('./RecoveryPassword').default,
        'recovery-password',
      );
      return {
        title,
        component: <RecoveryPassword query={query} title={title} />,
      };
    }

    const title = 'Khôi phục mật khẩu đăng nhập';
    const ForgotPassword = await require.ensure(
      [],
      require => require('./ForgotPassword').default,
      'forgot-password',
    );
    return {
      title,
      component: <ForgotPassword title={title} />,
    };
  },

};
