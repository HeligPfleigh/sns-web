import React from 'react';
import Layout from '../../components/Layout';

const title = 'Friends - SNS';

export default {

  path: '/friends',

  async action() {
    const Friends = await require.ensure([], require => require('./Friends').default, 'friends');
    return {
      title,
      component: <Layout><Friends title={title} /></Layout>,
    };
  },
};
