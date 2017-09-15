import { graphql } from 'react-apollo';

import reminderToPayFeeMutation from './ReminderToPayFeeMutation.graphql';

export default graphql(reminderToPayFeeMutation, {
  props: ({ mutate }) => ({
    reminderToPayFeeMutation: input => mutate({
      variables: {
        input,
      },
    }),
  }),
});
