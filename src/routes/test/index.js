/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';

const title = 'Test Graphql Query';

export default {

  path: '/test',
  async action() {
    const Login = await require.ensure([], require => require('./Login').default, 'test');
    return {
      title,
      component: <Login title={title} />,
    };
  },

};
