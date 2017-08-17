import React from 'react';
import Layout from '../../components/Layout';
import { checkAuth } from '../../utils/role';

export default {
  path: '/building-announcement/:buildingId',

  async action(context) {
    const redirect = checkAuth(context.store);
    if (redirect) return redirect;
    const BuildingAnnouncementPage = await require.ensure([], require => require('./BuildingAnnouncementPage').default, 'buildingannouncementpage');
    return {
      title: 'SNS - Thông báo của tòa nhà',
      component: <Layout><BuildingAnnouncementPage buildingId={context.params.buildingId} /></Layout>,
    };
  },
};
