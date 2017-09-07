import React from 'react';
import Layout from '../../components/Layout';
import { checkAuth } from '../../utils/role';

export default {
  path: '/announcement/:announcementId',
  children: [
    {
      path: '/',
      async action({ store, params }) {
        const redirect = checkAuth(store);
        if (redirect) return redirect;
        const AnnouncementDetail = await require.ensure([], require => require('./AnnouncementDetail').default, 'announcementdetail');
        return {
          title: 'Báo cáo chi tiết về phí dịch vụ',
          component: <Layout><AnnouncementDetail announcementId={params.announcementId} /></Layout>,
        };
      },
    },
  ],
};
