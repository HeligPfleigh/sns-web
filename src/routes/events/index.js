import React from 'react';
import Layout from '../../components/Layout';
import { checkAuth } from '../../utils/role';

export default {
  path: '/events',
  async action({ store }) {
    const redirect = checkAuth(store);
    if (redirect) return redirect;
    const Events = await require.ensure([], require => require('./Events').default, 'events');

    return {
      title: 'SNS - Sự kiện sắp tới',
      component: <Layout><Events /></Layout>,
    };
  },
};
