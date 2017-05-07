import React from 'react';
import User from './User';
import Layout from '../../components/Layout';
import { selectUser } from '../../selectors';

export default {

  path: '/user/:id',

  async action(context) {
    const { store } = context;

    if (!selectUser(store)) {
      return { redirect: '/login' };
    }

    return {
      title: 'SNS - User',
      component: <Layout><User /></Layout>,
    };
  },

};
