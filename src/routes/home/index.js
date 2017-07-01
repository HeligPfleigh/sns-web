import React from 'react';
import Layout from '../../components/Layout';
import { checkAuth } from '../../utils/role';

export default {
  path: '/',

  async action({ store }) {
    const redirect = checkAuth(store);
    if (redirect) return redirect;
    const Home = await require.ensure([], require => require('./Home').default, 'home');
    return {
      title: 'SNS - Trang chủ',
      component: <Layout><Home /></Layout>,
    };
  },

};
