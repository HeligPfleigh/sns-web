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

const title = 'Tài liệu của chung cư';

export default {

  path: '/building/:id/documents',

  async action() {
    const Document = await require.ensure([], require => require('./Document').default, 'Document');
    return {
      title,
      component: <Layout><Document title={title} /></Layout>,
    };
  },

};
