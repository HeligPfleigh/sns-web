import React from 'react';
import Layout from '../../components/Layout';
import { checkAuth } from '../../utils/role';

export default {
  path: '/building/:buildingId/report',
  children: [
    {
      path: '/',
      async action({ store, params }) {
        const redirect = checkAuth(store);
        if (redirect) return redirect;
        const FeeManagement = await require.ensure([], require => require('./FeeManagement').default, 'report');
        return {
          title: 'Báo cáo',
          component: <Layout><FeeManagement buildingId={params.buildingId} /></Layout>,
        };
      },
    },
  ],
};
