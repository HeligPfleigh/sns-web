import { graphql } from 'react-apollo';

import reminderToPayFeeMutation from './reminderToPayFeeMutation.graphql';

export default graphql(reminderToPayFeeMutation, {
  props: ({ mutate }) => ({
    reminderToPayFeeMutation: input => mutate({
      variables: {
        input,
      },
    }),
  }),
});
