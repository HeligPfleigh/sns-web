import React from 'react';
import Layout from '../../components/Layout';
import { checkAuth } from '../../utils/role';

const title = 'Messages - SNS';

export default {

  path: '/messages',

  async action({ store }) {
    const redirect = checkAuth(store);
    if (redirect) return redirect;
    const Messages = await require.ensure([], require => require('./Messages').default, 'messages');
    return {
      title,
      component: <Layout><Messages /></Layout>,
    };
  },

};
