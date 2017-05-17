import React from 'react';
import Layout from '../../components/Layout';
import { checkAuth } from '../../utils/role';

export default {

  path: '/post/:postId',
  async action({ store, params }) {
    const redirect = checkAuth(store);
    if (redirect) return redirect;
    const PostDetail = await require.ensure([], require => require('./PostDetail').default, 'post');
    return {
      title: 'SNS - Bài viết',
      chunk: 'post',
      component: <Layout><PostDetail postId={params.postId} /></Layout>,
    };
  },
};

