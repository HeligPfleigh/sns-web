import React from 'react';
import Layout from '../../components/Layout';
import { checkAuth } from '../../utils/role';

export default {
  path: '/user-approval/:id',

  async action({ store }) {
    const redirect = checkAuth(store);
    if (redirect) return redirect;
    const UserApprovalPage = await require.ensure([], require => require('./UserApprovalPage').default, 'userapprovalpage');
    return {
      title: 'SNS - Phê duyệt user',
      component: <Layout><UserApprovalPage /></Layout>,
    };
  },
};
