import React from 'react';
import Layout from '../../components/Layout';
import { checkAuth } from '../../utils/role';

export default {
  path: '/apartment',
  children: [
    {
      path: '/:apartmentId',
      async action({ store, params }) {
        const redirect = checkAuth(store);
        if (redirect) return redirect;
        const Notifications = await require.ensure(
            [],
            require => require('./Notifications').default,
            'Notifications',
          );
        return {
          title: 'Thông báo',
          component: <Layout><Notifications apartmentId={params.apartmentId} /></Layout>,
        };
      },
    }, {
      path: '/:apartmentId/notifications',
      async action({ store, params }) {
        const redirect = checkAuth(store);
        if (redirect) return redirect;
        const Notifications = await require.ensure(
          [],
          require => require('./Notifications').default,
          'Notifications',
        );
        return {
          title: 'Thông báo',
          component: <Layout><Notifications apartmentId={params.apartmentId} /></Layout>,
        };
      },
    }, {
      path: '/:apartmentId/service_fee',
      async action({ store, params }) {
        const redirect = checkAuth(store);
        if (redirect) return redirect;
        const FeeServicesPage = await require.ensure(
          [],
          require => require('./FeeServices').default,
          'FeeServices',
        );
        return {
          title: 'Phí dịch vụ',
          component: <Layout><FeeServicesPage apartmentId={params.apartmentId} /></Layout>,
        };
      },
    }, {
      path: '/:apartmentId/fee_chart',
      async action({ store, params }) {
        const redirect = checkAuth(store);
        if (redirect) return redirect;
        const FeeChart = await require.ensure(
          [],
          require => require('./FeeChart').default,
          'FeeChart',
        );
        return {
          title: 'Biểu đồ phí',
          component: <Layout><FeeChart apartmentId={params.apartmentId} /></Layout>,
        };
      },
    }, {
      path: '/:apartmentId/feedbacks',
      async action({ store, params }) {
        const redirect = checkAuth(store);
        if (redirect) return redirect;
        const Feedback = await require.ensure(
          [],
          require => require('./Feedbacks').default,
          'Feedback',
        );
        return {
          title: 'Góp ý',
          component: <Layout><Feedback apartmentId={params.apartmentId} /></Layout>,
        };
      },
    }, {
      path: '/:apartmentId/expense',
      async action({ store, params }) {
        const redirect = checkAuth(store);
        if (redirect) return redirect;
        const Expense = await require.ensure(
          [],
          require => require('./Expense').default,
          'Expense',
        );
        return {
          title: 'Sổ tay chi tiêu',
          component: <Layout><Expense buildingId={params.buildingId} /></Layout>,
        };
      },
    }, {
      path: '/:apartmentId/services',
      async action({ store, params }) {
        const redirect = checkAuth(store);
        if (redirect) return redirect;
        const Services = await require.ensure(
          [],
          require => require('./Services').default,
          'Services',
        );
        return {
          title: 'Dịch vụ',
          component: <Layout>
            <Services apartmentId={params.apartmentId} />
          </Layout>,
        };
      },
    }, {
      path: '/:apartmentId/utility',
      async action({ store, params }) {
        const redirect = checkAuth(store);
        if (redirect) return redirect;
        const Utility = await require.ensure(
          [],
          require => require('./Utility').default,
          'Utility',
        );
        return {
          title: 'Tiện ích',
          component: <Layout>
            <Utility apartmentId={params.apartmentId} />
          </Layout>,
        };
      },
    },
  ],
};
