import React from 'react';
import Layout from '../../components/Layout';
import { checkAuth } from '../../utils/role';

export default {

  path: '/my-buildings',

  async action({ store }) {
    const redirect = checkAuth(store);
    if (redirect) return redirect;
  },
  children: [
    {
      path: '/',
      async action() {
        const Home = await require.ensure(
          [],
          require => require('./Home/index').default,
          'MyBuildings-Home',
        );
        return {
          title: 'SNS - Danh sách chưng cư đã tham gia',
          component: <Layout><Home /></Layout>,
        };
      },
    }, {
      path: '/:buildingId',
      async action({ params }) {
        const Dashboard = await require.ensure(
          [],
          require => require('./Dashboard/MyBuilding').default,
          'MyBuildings-Dashboard',
        );
        return {
          title: 'SNS - Trang tin tổng hợp của tòa nhà',
          component: <Layout><Dashboard buildingId={params.buildingId} /></Layout>,
        };
      },
    }, {
      path: '/:buildingId/services',
      async action({ params, query }) {
        const BuildingService = await require.ensure(
          [],
          require => require('./Services/BuildingService').default,
          'MyBuildings-Services',
        );
        return {
          title: 'SNS - Trang tin tổng hợp phí dịch vụ theo tháng',
          component: <Layout><BuildingService query={query} buildingId={params.buildingId} /></Layout>,
        };
      },
    },
  ],
};
