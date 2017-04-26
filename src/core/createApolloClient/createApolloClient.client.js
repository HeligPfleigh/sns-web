import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { server } from '../../config';

const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: server.graphqlBrowser,
    opts: {
      // credentials: 'same-origin',
      credentials: 'include',
    },
  }),

  dataIdFromObject: o => o._id,
  queryDeduplication: true,
  reduxRootSelector: state => state.apollo,
  ssrMode: true,
});

export default function createApolloClient() {
  return client;
}
