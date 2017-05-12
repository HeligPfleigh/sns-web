import React from 'react';
import Layout from '../../components/Layout';
import { checkAuth } from '../../utils/role';

const title = 'Me - SNS';

export default {
  path: '/me',
  async action(context) {
    const redirect = checkAuth(context.store);
    if (redirect) return redirect;
    const Me = await require.ensure([], require => require('./Me').default, 'me');

    return {
      title,
      component: <Layout><Me query={context.query} /></Layout>,
    };
  },
};
