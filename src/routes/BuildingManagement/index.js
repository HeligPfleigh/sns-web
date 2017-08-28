import React from 'react';
import Layout from '../../components/Layout';
import { checkAuth } from '../../utils/role';

export default {
  path: '/management',
  children: [
    {
      path: '/',
      async action({ store }) {
        const redirect = checkAuth(store);
        if (redirect) return redirect;
        const HomeManagement = await require.ensure(
          [],
          require => require('./HomeManagement/index').default,
          'HomeManagement',
        );
        return {
          title: 'SNS - Ban quản lý tòa nhà',
          component: <Layout><HomeManagement /></Layout>,
        };
      },
    }, {
      path: '/:buildingId',
      async action({ store, params }) {
        const redirect = checkAuth(store);
        if (redirect) return redirect;
        const GroundManagement = await require.ensure(
          [],
          require => require('./GroundManagementPage/GroundManagement').default,
          'GroundManagement',
        );
        return {
          title: 'SNS - Ban quản lý tòa nhà',
          component: <Layout><GroundManagement buildingId={params.buildingId} /></Layout>,
        };
      },
    }, {
      path: '/:buildingId/approve_member',
      async action({ store, params }) {
        const redirect = checkAuth(store);
        if (redirect) return redirect;
        const MemberManagement = await require.ensure(
          [],
          require => require('./ResidentManagement/MemberManagementPage/MemberManagement').default,
          'MemberManagement',
        );
        return {
          title: 'SNS - Ban quản lý tòa nhà',
          component: <Layout><MemberManagement buildingId={params.buildingId} /></Layout>,
        };
      },
    }, {
      path: '/:buildingId/change_info',
      async action({ store, params }) {
        const redirect = checkAuth(store);
        if (redirect) return redirect;
        const ChangeInfoPage = await require.ensure(
          [],
          require => require('./ResidentManagement/ChangeInfoPage/index').default,
          'ChangeInfoPage',
        );
        return {
          title: 'SNS - Ban quản lý tòa nhà',
          component: <Layout><ChangeInfoPage buildingId={params.buildingId} /></Layout>,
        };
      },
    }, {
      path: '/:buildingId/fee_dashboard',
      async action({ store, params }) {
        const redirect = checkAuth(store);
        if (redirect) return redirect;
        const ReportPage = await require.ensure(
          [],
          require => require('./FeeManagement/ReportPage/index').default,
          'ReportPage',
        );
        return {
          title: 'SNS - Ban quản lý tòa nhà',
          component: <Layout><ReportPage buildingId={params.buildingId} /></Layout>,
        };
      },
    }, {
      path: '/:buildingId/fee_upload',
      async action({ store, params }) {
        const redirect = checkAuth(store);
        if (redirect) return redirect;
        const UploadPage = await require.ensure(
          [],
          require => require('./FeeManagement/UploadPage/index').default,
          'UploadPage',
        );
        return {
          title: 'SNS - Ban quản lý tòa nhà',
          component: <Layout><UploadPage buildingId={params.buildingId} /></Layout>,
        };
      },
    }, {
      path: '/:buildingId/fee_notications',
      async action({ store, params }) {
        const redirect = checkAuth(store);
        if (redirect) return redirect;
        const AnnouncementPage = await require.ensure(
          [],
          require => require('./FeeManagement/AnnouncementPage/index').default,
          'AnnouncementPage',
        );
        return {
          title: 'SNS - Ban quản lý tòa nhà',
          component: <Layout>
            <AnnouncementPage buildingId={params.buildingId} />
          </Layout>,
        };
      },
    }, {
      path: '/:buildingId/noti_other',
      async action({ store, params }) {
        const redirect = checkAuth(store);
        if (redirect) return redirect;
        const BuldingAnnouncementPage = await require.ensure(
          [],
          require => require('./AnnouncementPage/index').default,
          'BuldingAnnouncementPage',
        );
        return {
          title: 'SNS - Ban quản lý tòa nhà',
          component: <Layout>
            <BuldingAnnouncementPage buildingId={params.buildingId} />
          </Layout>,
        };
      },
    },
  ],
};
