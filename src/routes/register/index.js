/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';

const title = 'Đăng kí tài khoản';

export default {

  path: '/register',

  async action() {
    const Register = await require.ensure([], require => require('./Register').default, 'register');

    return {
      title,
      component: <Register title={title} />,
    };
  },

};
