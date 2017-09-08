/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';

const title = 'Lỗi: Quyền truy cập hệ thống';

export default {
  path: '/permission-error',

  async action() {
    const PermissionError = await require.ensure(
      [],
      require => require('./PermissionError').default,
      'PermissionError',
    );

    return {
      title,
      component: <PermissionError title={title} />,
    };
  },
};
