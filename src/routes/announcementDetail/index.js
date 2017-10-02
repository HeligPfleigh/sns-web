import React from 'react';
import Layout from '../../components/Layout';
import { checkAuth } from '../../utils/role';

export default {
  path: '/announcement/:announcementId',
  children: [
    {
      path: '/',
      async action({ store, params, query }) {
        const redirect = checkAuth(store);
        if (redirect) return redirect;
        const AnnouncementDetail = await require.ensure([], require => require('./AnnouncementDetail').default, 'announcementdetail');
        return {
          title: 'Trang thông báo chi tiết',
          component: <Layout><AnnouncementDetail query={query} announcementId={params.announcementId} /></Layout>,
        };
      },
    },
  ],
};
