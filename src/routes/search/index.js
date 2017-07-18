import React from 'react';
import Layout from '../../components/Layout';
import { checkAuth } from '../../utils/role';

const title = 'Search Friends - SNS';

export default {

  path: '/search',

  async action(context) {
    const redirect = checkAuth(context.store);
    if (redirect) return redirect;
    const Search = await require.ensure([], require => require('./Search').default, 'search');
    return {
      title,
      component: <Layout><Search query={context.query} /></Layout>,
    };
  },

};
