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

  path: '/about',

  async action() {
    const About = await require.ensure([], require => require('./About').default, 'about');

    return {
      title: 'SNS - About us',
      chunk: 'about',
      component: <About />,
    };
  },
};
