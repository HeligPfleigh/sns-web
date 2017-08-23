import React from 'react';

const title = 'Page Not Found';

export default {

  path: '*',

  async action() {
    const NotFound = await require.ensure([], require => require('./NotFound').default, 'notfound');

    return {
      title,
      component: <NotFound title={title} />,
      status: 404,
    };
  },

};
