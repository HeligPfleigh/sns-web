import React from 'react';
import Layout from '../../components/Layout';

const title = 'Page Not Found';

export default {

  path: '*',

  async action() {
    const NotFound = await require.ensure([], require => require('./NotFound').default, 'notfound');

    return {
      title,
      component: <Layout><NotFound title={title} /></Layout>,
      status: 404,
    };
  },

};
