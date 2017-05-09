/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';

export default {

  path: '/error',

  async action({ error }) {
    const ErrorPage = await require.ensure([], require => require('./ErrorPage').default, 'error');

    return {
      title: error.name,
      description: error.message,
      component: <ErrorPage error={error} />,
      status: error.status || 500,
    };
  },

};
