import ApolloClient, { createNetworkInterface } from 'apollo-client';
import config from '../../config';

export default function createApolloClient(options) {
  const networkInterface = createNetworkInterface({
    uri: config.server.graphql,
    opts: {
      // credentials: 'same-origin',
      credentials: 'include',
    },
  });

  networkInterface.use([{
    applyMiddleware(req, next) {
      if (!req.options.headers) {
        req.options.headers = {};  // Create the header object if needed.
      }
      const token = options.rootValue.request.cookies.id_token;
      req.options.headers.authorization = token ? `${token}` : null;
      next();
    },
  }]);

  return new ApolloClient({
    reduxRootSelector: state => state.apollo,
    // networkInterface: new ServerInterface(options),
    networkInterface,
    dataIdFromObject: o => o._id,
    queryDeduplication: true,
    ssrMode: true,
  });
}
