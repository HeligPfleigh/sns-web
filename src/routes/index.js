/* eslint-disable global-require */

// The top-level (parent) route
export default {

  path: '/',

  // Keep in mind, routes are evaluated in order
  children: [
    require('./home').default,
    require('./friends').default,
    require('./building').default,
    require('./messages').default,
    require('./contact').default,
    require('./login').default,
    require('./register').default,
    require('./active').default,
    require('./about').default,
    require('./privacy').default,
    require('./notifications').default,
    require('./post').default,
    require('./user').default,
    require('./me').default,
    require('./search').default,
    require('./userApprovalPage').default,
    require('./events').default,
    require('./buildingAnnouncementPage').default,
    require('./report').default,
    require('./feeDetails').default,
    require('./waiting').default,
    // Wildcard routes, e.g. { path: '*', ... } (must go last)
    require('./notFound').default,
  ],

  async action({ next }) {
    // Execute each child route until one of them return the result
    const route = await next();

    // Provide default values for title, description etc.
    route.title = `${route.title || 'Untitled Page'}`;
    route.description = route.description || '';

    return route;
  },

};
