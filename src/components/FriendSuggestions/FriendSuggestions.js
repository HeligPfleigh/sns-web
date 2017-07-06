/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes } from 'react';
import { graphql, compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import gql from 'graphql-tag';
import FriendList from '../../components/Friend/FriendList';
import { NONE } from '../../constants';
import s from './FriendSuggestions.css';

const friendSuggestionsQuery = gql`query friendSuggestionsQuery {
  me {
    _id
    friendSuggestions {
      _id
      profile {
        firstName
        lastName
        picture
      }
    }
  }
}
`;

const sendFriendRequest = gql`mutation sendFriendRequest ($_id: String!) {
  sendFriendRequest(_id: $_id) {
    _id
    profile {
      picture
    }
  }
}`;

class FriendSuggestions extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
    }).isRequired,
    sendFriendRequest: PropTypes.func.isRequired,
  };

  render() {
    const { data: { loading, me } } = this.props;
    const hasFriendSuggest = me && me.friendSuggestions && me.friendSuggestions.length > 0;
    return (
      <div className={hasFriendSuggest ? '' : s.friendSuggestionHide}>
        {loading && <h1 style={{ textAlign: 'center' }}>Đang tải dữ liệu</h1>}
        {!loading && <FriendList friends={me.friendSuggestions} friendType={NONE} handleFriendAction={this.props.sendFriendRequest} />}
      </div>
    );
  }
}

export default compose(
  withStyles(s),
  graphql(friendSuggestionsQuery, {}),
  graphql(sendFriendRequest, {
    props: ({ mutate }) => ({
      sendFriendRequest: _id => mutate({
        variables: { _id },
        refetchQueries: [{
          query: friendSuggestionsQuery,
        }],
      }),
    }),
  }),

)(FriendSuggestions);
