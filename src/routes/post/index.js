import React from 'react';
import Layout from '../../components/Layout';

export default {

  path: '/post/:postId',

  async action(context) {
    const PostDetail = await require.ensure([], require => require('./PostDetail').default, 'post');

    return {
      title: 'SNS - Bài viết',
      chunk: 'post',
      component: <Layout><PostDetail postId={context.params.postId} /></Layout>,
    };
  },
};

