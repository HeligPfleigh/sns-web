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
          'Building.List',
        );
        return {
          title: 'SNS - Ban quản lý tòa nhà',
          component: <Layout><HomeManagement /></Layout>,
        };
      },
    }, {
      path: '/:buildingId',
      children: [
        {
          path: '/',
          async action({ params }) {
            const GroundManagement = await require.ensure(
              [],
              require => require('./GroundManagementPage/GroundManagement').default,
              'Building.Ground.Home',
            );
            return {
              title: 'SNS - Ban quản lý tòa nhà',
              component: <Layout>
                <GroundManagement buildingId={params.buildingId} />
              </Layout>,
            };
          },
        },
        {
          path: '/ground-management',
          async action({ params }) {
            const GroundManagement = await require.ensure(
              [],
              require => require('./GroundManagementPage/GroundManagement').default,
              'Building.Ground.List',
            );
            return {
              title: 'SNS - Ban quản lý tòa nhà',
              component: <Layout>
                <GroundManagement buildingId={params.buildingId} />
              </Layout>,
            };
          },
        },
        {
          path: '/resident',
          children: [
            {
              path: '/list',
              async action({ params }) {
                const BuildingMember = await require.ensure(
                  [],
                  require => require('./ResidentManagement/BuildingMemberPage/BuildingMember').default,
                  'Building.Resident.List',
                );
                return {
                  title: 'SNS - Danh sách thành viên tòa nhà',
                  component: <Layout>
                    <BuildingMember buildingId={params.buildingId} />
                  </Layout>,
                };
              },
            },
            {
              path: '/detail/:id',
              async action({ params }) {
                const MemberDetail = await require.ensure(
                  [],
                  require => require('./ResidentManagement/BuildingMemberPage/MemberDetail').default,
                  'Building.Resident.Detail',
                );
                return {
                  title: 'SNS - Thông tin thành viên',
                  component: <Layout>
                    <MemberDetail requestId={params.id} buildingId={params.buildingId} />
                  </Layout>,
                };
              },
            },
            {
              path: '/change_info/:id',
              async action({ params }) {
                const MemberDetail = await require.ensure(
                  [],
                  require => require('./ResidentManagement/BuildingMemberPage/MemberDetail').default,
                  'Building.Resident.ChangeInfo',
                );
                return {
                  title: 'SNS - Cập nhật thông tin thành viên',
                  component: <Layout>
                    <MemberDetail requestId={params.id} buildingId={params.buildingId} isUpdateInfo />
                  </Layout>,
                };
              },
            },
            {
              path: '/approve_member',
              children: [
                {
                  path: '/list',
                  async action({ params }) {
                    const MemberManagement = await require.ensure(
                      [],
                      require => require('./ResidentManagement/MemberManagementPage/MemberManagement').default,
                      'Building.Approval.Member.List',
                    );
                    return {
                      title: 'SNS - Danh sách cư dân gửi yêu cầu làm thành viên tòa nhà',
                      component: <Layout>
                        <MemberManagement buildingId={params.buildingId} />
                      </Layout>,
                    };
                  },
                },
                {
                  path: '/:id',
                  async action(context) {
                    const UserApprovalPage = await require.ensure(
                      [], require => require('./ResidentManagement/MemberManagementPage/UserDetailAwaitingApproval').default,
                      'Building.Approval.Member.Detail',
                    );
                    return {
                      title: 'SNS - Phê duyệt thành viên mới của tòa nhà',
                      component: <Layout>
                        <UserApprovalPage requestId={context.params.id} />
                      </Layout>,
                    };
                  },
                },
              ],
            },
          ],
        },
        {
          path: '/fee',
          children: [
            {
              path: '/list',
              async action({ params }) {
                const ReportPage = await require.ensure(
                  [],
                  require => require('./FeeManagement/ReportPage').default,
                  'Building.Fee.List',
                );
                return {
                  title: 'SNS - Thông tin biểu phí các căn hộ thuộc chung cư',
                  component: <Layout>
                    <ReportPage buildingId={params.buildingId} />
                  </Layout>,
                };
              },
            },
            {
              path: '/detail/:feeId',
              async action({ params }) {
                const FeeDetails = await require.ensure(
                  [],
                  require => require('./FeeManagement/FeeDetail').default,
                  'Building.Fee.Detail',
                );
                return {
                  title: 'SNS - Chi tiết về phí dịch vụ',
                  component: <Layout><FeeDetails feeId={params.feeId} /></Layout>,
                };
              },
            },
            {
              path: '/upload',
              async action({ params }) {
                const UploadPage = await require.ensure(
                  [],
                  require => require('./FeeManagement/UploadPage/index').default,
                  'Building.Fee.Upload',
                );
                return {
                  title: 'SNS - Cập nhật thông biểu phí định kì',
                  component: <Layout>
                    <UploadPage buildingId={params.buildingId} />
                  </Layout>,
                };
              },
            },
            {
              path: '/notication',
              async action({ params }) {
                const AnnouncementPage = await require.ensure(
                  [],
                  require => require('./FeeManagement/AnnouncementPage').default,
                  'Building.Fee.Announcement',
                );
                return {
                  title: 'SNS - Thông báo phí',
                  component: <Layout>
                    <AnnouncementPage buildingId={params.buildingId} />
                  </Layout>,
                };
              },
            },
          ],
        },
        {
          path: '/announcement',
          children: [
            {
              path: '/create',
              async action({ params }) {
                const Announcement = await require.ensure(
                  [],
                  require => require('./NewAnnouncement/index').default,
                  'Building.Announcement.Create',
                );
                return {
                  title: 'SNS - Thêm thông báo của ban quản lý tòa nhà',
                  component: <Layout>
                    <Announcement buildingId={params.buildingId} />
                  </Layout>,
                };
              },
            },
            {
              path: '/list',
              async action({ params }) {
                const AnnouncementsManagement = await require.ensure(
                  [],
                  require => require('./AnnouncementsManagement/index').default,
                  'Building.Announcement.List',
                );
                return {
                  title: 'SNS - Thông báo của ban quản lý tòa nhà',
                  component: <Layout>
                    <AnnouncementsManagement buildingId={params.buildingId} />
                  </Layout>,
                };
              },
            },
          ],
        },
        {
          path: '/settings',
          children: [
            {
              path: '/',
              async action({ params }) {
                const GeneralSetting = await require.ensure(
                  [],
                  require => require('./SettingManagement').GeneralSetting,
                  'Building.Setting.General',
                );
                return {
                  title: 'SNS - Cài đặt chung cho tòa nhà',
                  component: <Layout>
                    <GeneralSetting buildingId={params.buildingId} />
                  </Layout>,
                };
              },
            },
            {
              path: '/fee',
              async action({ params }) {
                const FeeSetting = await require.ensure(
                  [],
                  require => require('./SettingManagement/index').FeeSetting,
                  'Building.Setting.Fee',
                );
                return {
                  title: 'SNS - Cài đặt cho Phí - Hóa đơn của tòa nhà',
                  component: <Layout>
                    <FeeSetting buildingId={params.buildingId} />
                  </Layout>,
                };
              },
            },
          ],
        },
      ],
    },
  ],
};
