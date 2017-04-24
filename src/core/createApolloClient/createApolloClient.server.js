import {
  validate,
  execute,
  specifiedRules,
} from 'graphql';

import ApolloClient, { createNetworkInterface } from 'apollo-client';

// Execute all GraphQL requests directly without
class ServerInterface {
  constructor(optionsData) {
    this.schema = optionsData.schema;
    this.optionsData = optionsData;
  }

  async query({ query, variables, operationName }) {
    try {
      let validationRules = specifiedRules;
      const customValidationRules = this.optionsData.validationRules;
      if (customValidationRules) {
        validationRules = validationRules.concat(customValidationRules);
      }

      const validationErrors = validate(this.schema, query, validationRules);
      if (validationErrors.length > 0) {
        return { errors: validationErrors };
      }

      const result = await execute(
        this.schema,
        query,
        this.optionsData.rootValue,
        this.optionsData.context,
        variables,
        operationName,
      );
      console.log(result, result);
      return result;
    } catch (contextError) {
      return { errors: [contextError] };
    }
  }
}

export default function createApolloClient(options) {
  const networkInterface = createNetworkInterface({
    uri: 'http://localhost:3006/graphql',
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
      // // get the authentication token from local storage if it exists
      // const token = localStorage.getItem('token');
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
