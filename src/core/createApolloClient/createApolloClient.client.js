import ApolloClient, { createNetworkInterface } from 'apollo-client';
import config from '../../config';

const networkInterface = createNetworkInterface({
  uri: config.server.graphqlBrowser,
  opts: {
    // credentials: 'same-origin',
    credentials: 'include',
  },
});

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

networkInterface.use([{
  applyMiddleware(req, next) {
    if (!req.options.headers) {
      req.options.headers = {};  // Create the header object if needed.
    }
    const token = getCookie('id_token');
    req.options.headers.authorization = token ? `${token}` : null;
    next();
  },
}]);

const client = new ApolloClient({
  networkInterface,
  dataIdFromObject: o => o._id,
  // dataIdFromObject: (result) => {
  //   if (result._id && result.__typename) {
  //     return result.__typename + result._id;
  //   }
  //   return null;
  // },
  queryDeduplication: true,
  reduxRootSelector: state => state.apollo,
  ssrMode: true,
});

export default function createApolloClient() {
  return client;
}
