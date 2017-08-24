import React from 'react';
import Layout from '../../components/Layout';
import { checkAuth } from '../../utils/role';

export default {
  path: '/building/:buildingId/fee/:feeId',
  children: [
    {
      path: '/',
      async action({ store, params }) {
        const redirect = checkAuth(store);
        if (redirect) return redirect;
        const FeeDetails = await require.ensure([], require => require('./FeeDetails').default, 'feedetails');
        return {
          title: 'Báo cáo chi tiết về phí dịch vụ',
          component: <Layout><FeeDetails buildingId={params.buildingId} feeId={params.feeId} /></Layout>,
        };
      },
    },
  ],
};
