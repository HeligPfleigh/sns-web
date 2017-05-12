import React from 'react';
import Layout from '../../components/Layout';

export default {

  path: '/user/:id',

  async action(context) {
    const User = await require.ensure([], require => require('./User').default, 'user');
    return {
      title: 'SNS - User',
      component: <Layout><User query={context.query} id={context.params.id} /></Layout>,
    };
  },

};
