import React from 'react';
import Layout from '../../components/Layout';
import { checkAuth } from '../../utils/role';

const title = 'Friends - SNS';

export default {

  path: '/friends',

  async action({ store }) {
    const redirect = checkAuth(store);
    if (redirect) return redirect;
    const Friends = await require.ensure([], require => require('./Friends').default, 'friends');
    return {
      title,
      component: <Layout><Friends title={title} /></Layout>,
    };
  },
};
