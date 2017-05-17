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

const title = 'Page Not Found';

export default {

  path: '*',

  async action() {
    const NotFound = await require.ensure([], require => require('./NotFound').default, 'notfound');

    return {
      title,
      component: <Layout><NotFound title={title} /></Layout>,
      status: 404,
    };
  },

};
