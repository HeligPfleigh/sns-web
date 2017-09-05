import React from 'react';
import Layout from '../../components/Layout';
import { checkAuth } from '../../utils/role';

export default {
  path: '/announcements',

  async action(context) {
    const redirect = checkAuth(context.store);
    if (redirect) return redirect;
    const BuildingAnnouncementPage = await require.ensure([], require => require('./BuildingAnnouncementPage').default, 'buildingannouncementpage');
    return {
      title: 'SNS - Thông báo của tòa nhà',
      component: <Layout><BuildingAnnouncementPage /></Layout>,
    };
  },
};
