import React from 'react';
import Layout from '../../components/Layout';
import { checkAuth } from '../../utils/role';

export default {
  path: '/events',
  children: [
    {
      path: '/',
      async action({ store }) {
        const redirect = checkAuth(store);
        if (redirect) return redirect;
        const Events = await require.ensure([], require => require('./Events').default, 'events');
        return {
          title: 'SNS - Sự kiện sắp tới',
          component: <Layout><Events /></Layout>,
        };
      },
    }, {
      path: '/:eventId',
      async action(context) {
        const { store } = context;
        const redirect = checkAuth(store);
        if (redirect) return redirect;
        const EventDetailPage = await require.ensure([], require => require('./EventDetailPage/EventDetailPage').default, 'events');

        return {
          title: 'SNS - Sự kiện sắp tới',
          component: <Layout><EventDetailPage eventId={context.params.eventId} /></Layout>,
        };
      },
    },
  ],
};
