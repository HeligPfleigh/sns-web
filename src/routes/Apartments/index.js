import React from 'react';
import Layout from '../../components/Layout';
import { checkAuth } from '../../utils/role';

export default {
  path: '/apartments',
  async action({ store }) {
    const redirect = checkAuth(store);
    if (redirect) return redirect;
    const ApartmentList = await require.ensure([], require => require('./ApartmentList').default, 'apartments');
    return {
      title: 'Danh sách căn hộ',
      chunk: 'apartments',
      component: <Layout><ApartmentList /></Layout>,
    };
  },
};

