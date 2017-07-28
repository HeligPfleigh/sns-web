import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import FriendsList, { FriendItem } from '../../components/FriendsList';
import Label from '../../components/Friend/Label';
import friendSuggestionsQuery from './friendSuggestionsQuery.graphql';
import sendFriendRequestMutation from './sendFriendRequestMutation.graphql';
import s from './FriendSuggestions.css';

class FriendSuggestions extends Component {
  render() {
    const { data: { loading, resident } } = this.props;
    return (
      <div>
        {loading && <h1 style={{ textAlign: 'center' }}>Đang tải dữ liệu</h1>}
        {!loading && <FriendsList>
          <li style={{ paddingLeft: '10px' }}>
            <Label label="Giới thiệu bạn bè" />
          </li>
          {
            resident.friendSuggestions.edges.map(friend =>
              <FriendItem
                key={friend._id}
                friend={friend}
                handleFriendAction={this.props.sendFriendRequest}
              />,
            )
          }
        </FriendsList>
        }
      </div>
    );
  }
}

FriendSuggestions.propTypes = {
  data: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
  }).isRequired,
  sendFriendRequest: PropTypes.func.isRequired,
};

export default compose(
  withStyles(s),
  connect(state => ({
    user: state.user,
  })),
  graphql(friendSuggestionsQuery, {
    options: ownProps => ({
      variables: {
        _id: ownProps.user.id,
        cursor: null,
      },
      fetchPolicy: 'network-only',
    }),
  }),
  graphql(sendFriendRequestMutation, {
    props: ({ ownProps, mutate }) => ({
      sendFriendRequest: _id => mutate({
        variables: { _id },
        refetchQueries: [{
          query: friendSuggestionsQuery,
          variables: {
            _id: ownProps.user.id,
            cursor: null,
          },
        }],
      }),
    }),
  }),
)(FriendSuggestions);
