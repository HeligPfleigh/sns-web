import React from 'react';
import Layout from '../../components/Layout';
import Me from './Me';

const title = 'Me - SNS';

export default {
  path: '/me',
  async action(context) {
    return {
      title,
      component: <Layout><Me query={context.query} /></Layout>,
    };
  },
};
