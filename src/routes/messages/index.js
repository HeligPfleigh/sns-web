import React from 'react';
import Layout from '../../components/Layout';

const title = 'Messages - SNS';

export default {

  path: '/messages',

  async action() {
    const Messages = await require.ensure([], require => require('./Messages').default, 'messages');
    return {
      title,
      component: <Layout><Messages /></Layout>,
    };
  },

};
