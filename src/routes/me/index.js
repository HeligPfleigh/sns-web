import React from 'react';
import Layout from '../../components/Layout';

const title = 'Me - SNS';

export default {
  path: '/me',
  async action(context) {
    
    const Me = await require.ensure([], require => require('./Me').default, 'me');
    
    return {
      title,
      component: <Layout><Me query={context.query} /></Layout>,
    };
  },
};
