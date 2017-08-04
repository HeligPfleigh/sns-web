import React from 'react';
import Layout from '../../components/Layout';
import { checkAuth } from '../../utils/role';

export default {
  path: '/user-approval/:id',

  async action(context) {
    const redirect = checkAuth(context.store);
    if (redirect) return redirect;
    const UserApprovalPage = await require.ensure([], require => require('./UserApprovalPage').default, 'userapprovalpage');
    return {
      title: 'SNS - Phê duyệt user',
      component: <Layout><UserApprovalPage userId={context.params.id} /></Layout>,
    };
  },
};
