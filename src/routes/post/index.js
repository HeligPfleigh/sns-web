import React from 'react';
import Layout from '../../components/Layout';

export default {

  path: '/post/:postId',

  async action(context) {
    const Post = await require.ensure([], require => require('./Post').default, 'post');

    return {
      title: 'SNS - Bài viết',
      chunk: 'post',
      component: <Layout><Post postId={context.params.postId} /></Layout>,
    };
  },
};

