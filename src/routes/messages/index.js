import React from 'react';
import Layout from '../../components/Layout';
import { checkAuth } from '../../utils/role';

const title = 'Messages - SNS';

export default {

  path: '/messages',
  children: [
    {
      path: '/',
      async action(context) {
        const { store } = context;
        const redirect = checkAuth(store);
        if (redirect) return redirect;
        const Messages = await require.ensure([], require => require('./Messages').default, 'messages');
        return {
          title,
          component: <Layout><Messages /></Layout>,
        };
      },
    }, {
      path: '/:conversationId',
      async action(context) {
        const { store } = context;
        const redirect = checkAuth(store);
        if (redirect) return redirect;
        const Messages = await require.ensure([], require => require('./Messages').default, 'messages');
        return {
          title,
          component: <Layout><Messages conversationId={context.params.conversationId} /></Layout>,
        };
      },
    },
  ],
};
