import React from 'react';
import Layout from '../../components/Layout';
import { selectUser } from '../../selectors';

export default {

  path: '/user/:id',

  async action(context) {
    const { store } = context;

    if (!selectUser(store)) {
      return { redirect: '/login' };
    }
    const User = await require.ensure([], require => require('./User').default, 'user');

    return {
      title: 'SNS - User',
      component: <Layout><User /></Layout>,
    };
  },

};
