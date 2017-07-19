import React from 'react';
import Layout from '../../components/Layout';
import { checkAuth } from '../../utils/role';

export default {
  path: '/building/:buildingId',

  async action({ store, params, query }) {
    const redirect = checkAuth(store);
    if (redirect) return redirect;
    const Building = await require.ensure([], require => require('./Building').default, 'building');
    return {
      title: 'SNS - Trang chủ',
      component: <Layout><Building query={query} buildingId={params.buildingId} /></Layout>,
    };
  },

};
