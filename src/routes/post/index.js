import React from 'react';
import Layout from '../../components/Layout';

const title = 'Post Page';

export default {

  path: '/post/:id',

  async action() {
    const Post = await require.ensure([], require => require('./Post').default, 'post');

    return {
      title,
      chunk: 'post',
      component: <Layout><Post title={title} /></Layout>,
    };
  },
};

