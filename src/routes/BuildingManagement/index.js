import React from 'react';
import Layout from '../../components/Layout';
import { checkAuthAdmin } from '../../utils/role';

export default {
  path: '/management',
  async action({ store }) {
    const redirect = checkAuthAdmin(store);
    if (redirect) return redirect;
  },
  children: [
    {
      path: '/',
      async action() {
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
      async action({ params }) {
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
      async action({ params }) {
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
      path: '/user-approval/:id',
      async action(context) {
        const UserApprovalPage = await require.ensure(
          [], require => require('./ResidentManagement/MemberManagementPage/UserDetailAwaitingApproval').default,
          'UserApprovalPage',
        );
        return {
          title: 'SNS - Phê duyệt user',
          component: <Layout><UserApprovalPage requestId={context.params.id} /></Layout>,
        };
      },
    }, {
      path: '/:buildingId/change_info',
      async action({ params }) {
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
      async action({ params }) {
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
      async action({ params }) {
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
      async action({ params }) {
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
      path: '/:buildingId/create_announcement',
      async action({ params }) {
        const Announcement = await require.ensure(
          [],
          require => require('./NewAnnouncement/index').default,
          'Announcement',
        );
        return {
          title: 'SNS - Ban quản lý tòa nhà',
          component: <Layout>
            <Announcement buildingId={params.buildingId} />
          </Layout>,
        };
      },
    }, {
      path: '/:buildingId/announcements_management',
      async action({ params }) {
        const AnnouncementsManagement = await require.ensure(
          [],
          require => require('./AnnouncementsManagement/index').default,
          'AnnouncementsManagement',
        );
        return {
          title: 'SNS - Ban quản lý tòa nhà',
          component: <Layout>
            <AnnouncementsManagement buildingId={params.buildingId} />
          </Layout>,
        };
      },
    }, {
      path: '/:buildingId/settings',
      children: [
        {
          path: '/',
          async action({ params }) {
            const GeneralSetting = await require.ensure(
              [],
              require => require('./SettingManagement').GeneralSetting,
              'BuildingSetting.General',
            );
            return {
              title: 'SNS - Cài đặt chung cho tòa nhà',
              component: <Layout><GeneralSetting buildingId={params.buildingId} /></Layout>,
            };
          },
        },
        {
          path: '/fee',
          async action({ params }) {
            const FeeSetting = await require.ensure(
              [],
              require => require('./SettingManagement/index').FeeSetting,
              'BuildingSetting.Fee',
            );
            return {
              title: 'SNS - Cài đặt cho Phí - Hóa đơn của tòa nhà',
              component: <Layout><FeeSetting buildingId={params.buildingId} /></Layout>,
            };
          },
        },
      ],
    },
  ],
};
