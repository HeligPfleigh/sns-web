import ApolloClient, { createNetworkInterface } from 'apollo-client';
import isEmpty from 'lodash/isEmpty';
import config from '../../config';

export default function createApolloClient(options) {
  const networkInterface = createNetworkInterface({
    uri: config.server.graphql,
    opts: {
      credentials: process.env.BROWSER_IP ? 'include' : 'same-origin',
    },
  });

  networkInterface.use([{
    applyMiddleware(req, next) {
      if (!req.options.headers) {
        req.options.headers = {};  // Create the header object if needed.
      }
      const token = options.rootValue.request.cookies.id_token;
      if (token && !isEmpty(token)) {
        req.options.headers.authorization = token;
      }

      next();
    },
  }]);

  return new ApolloClient({
    reduxRootSelector: state => state.apollo,
    // networkInterface: new ServerInterface(options),
    networkInterface,
    // dataIdFromObject: o => o._id,
    dataIdFromObject: (result) => {
      if (result._id && result.__typename) {
        return result.__typename + result._id;
      }
      return null;
    },
    queryDeduplication: true,
    ssrMode: true,
  });
}
