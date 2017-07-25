/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';

const title = 'Kích hoạt tài khoản';

export default {
  path: '/active',

  children: [
    {
      path: '/',
      async action({ store }) {
        const state = store.getState();
        if (state.user) {
          return { redirect: '/' };
        }

        const Active = await require.ensure([], require => require('./Active').default, 'active');

        return {
          title,
          component: <Active title={title} />,
        };
      },
    },
    {
      path: '/:username',
      async action({ store, params: { username } }) {
        const state = store.getState();
        if (state.user) {
          return { redirect: '/' };
        }

        const Active = await require.ensure([], require => require('./Active').default, 'active');

        return {
          title,
          component: <Active username={username} title={title} />,
        };
      },
    },
  ],
};
