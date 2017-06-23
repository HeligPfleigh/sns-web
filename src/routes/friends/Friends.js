import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import update from 'immutability-helper';
import { Grid, Row, Col } from 'react-bootstrap';
import Loading from '../../components/Loading';
import { PENDING, ACCEPTED, REJECTED } from '../../constants';
import s from './Friends.scss';
import Label from '../../components/Friend/Label';
import FriendsList, { FriendItem, FriendActionItem } from './FriendsList';

const friendsPageQuery = gql`query friendsPageQuery {
  me {
    _id
    username,
    profile {
      picture
      firstName
      lastName
    }
    friends {
      _id
      profile {
        picture
        firstName
        lastName
      }
    }
    friendRequests {
      _id
      profile {
        picture
        firstName
        lastName
      }
    }
    friendSuggestions {
      _id
      profile {
        picture
        firstName
        lastName
      }
    }
  }
}
`;

const sendFriendRequest = gql`mutation sendFriendRequest ($userId: String!) {
  sendFriendRequest(_id: $userId) {
    _id,
  }
}`;

const acceptFriend = gql`mutation acceptFriend ($userId: String!) {
  acceptFriend(_id: $userId) {
    _id,
  }
}`;

const rejectFriend = gql`mutation rejectFriend ($userId: String!) {
  rejectFriend(_id: $userId) {
    _id,
  }
}`;

const mapResultsToProps = ({ data }) => {
  if (!data.me) {
    return {
      loading: data.loading,
    };
  }
  const { me } = data;

  return {
    loading: data.loading,
    me,
    data,
  };
};
const mapPropsToOptions = () => ({
  variables: {},
  // pollInterval: 30000,
  // fetchPolicy: 'cache-and-network',
});

class Friends extends React.Component {
  // handleFriendAction = (userId, cmd) => {
  //   this.props.friendAction({
  //     variables: { userId, cmd },
  //     ...cmd === PENDING && {
  //       refetchQueries: [{
  //         query: friendsPageQuery,
  //       }],
  //     },
  //     ...(cmd === ACCEPTED || cmd === REJECTED) && {
  //       updateQueries: {
  //         friendsPageQuery: (previousResult, { mutationResult }) => {
  //           const newFriend = mutationResult.data.friendAction;
  //           return update(previousResult, {
  //             me: {
  //               friends: {
  //                 $unshift: [newFriend],
  //               },
  //               friendRequests: {
  //                 $unset: [newFriend._id],
  //               },
  //             },
  //           });
  //         },
  //       },
  //     },
  //   });
  // }
  render() {
    const {
      data: { loading, me },
      sendFriendRequestAction,
      acceptFriendAction,
      rejectFriendAction,
    } = this.props;
    return (
      <Grid>
        <Loading show={loading} full />
        <Row className={s.containerTop30}>
          <Col md={8} xs={12}>
            {
              me && me.friendRequests &&
              <FriendsList>
                <Label label={`Respond to Your ${me.friendRequests.length} Friend Requests`}></Label>
                {
                  me.friendRequests.map(friend =>
                    <FriendActionItem
                      key={friend._id}
                      friend={friend}
                      handleAcceptFriendAction={acceptFriendAction}
                      handleRejectFriendAction={rejectFriendAction}
                    />,
                  )
                }
              </FriendsList>
            }
          </Col>
          <Col md={4} xs={12}>
            {
              me && me.friendSuggestions && me.friendSuggestions.length > 0 &&
              <FriendsList>
                {
                  me.friendSuggestions.map(friend =>
                    <FriendItem
                      key={friend._id}
                      friend={friend}
                      handleFriendAction={sendFriendRequestAction}
                    />,
                  )
                }
              </FriendsList>
            }
          </Col>
        </Row>
      </Grid>
    );
  }
}

Friends.propTypes = {
  sendFriendRequestAction: PropTypes.func.isRequired,
  acceptFriendAction: PropTypes.func.isRequired,
  rejectFriendAction: PropTypes.func.isRequired,
  data: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
  }).isRequired,
};
Friends.defaultProps = {};

export default compose(
  withStyles(s),
  graphql(friendsPageQuery, {
    options: mapPropsToOptions,
    props: mapResultsToProps,
  }),
  graphql(acceptFriend, {
    props: ({ mutate }) => ({
      acceptFriendAction: userId => mutate({
        variables: { userId },
        updateQueries: {
          friendsPageQuery: (previousResult, { mutationResult }) => {
            const newFriend = mutationResult.data.acceptFriend;
            return update(previousResult, {
              me: {
                friendRequests: {
                  $unset: [newFriend._id],
                },
              },
            });
          },
        },
      }),
    }),
  }),
  graphql(rejectFriend, {
    props: ({ mutate }) => ({
      rejectFriendAction: userId => mutate({
        variables: { userId },
        updateQueries: {
          friendsPageQuery: (previousResult, { mutationResult }) => {
            const newFriend = mutationResult.data.rejectFriend;
            return update(previousResult, {
              me: {
                friendRequests: {
                  $unset: [newFriend._id],
                },
              },
            });
          },
        },
      }),
    }),
  }),
  graphql(sendFriendRequest, {
    props: ({ mutate }) => ({
      sendFriendRequestAction: userId => mutate({
        variables: { userId },
        updateQueries: {
          friendsPageQuery: (previousResult, { mutationResult }) => {
            const newFriend = mutationResult.data.sendFriendRequest;
            return update(previousResult, {
              me: {
                friendSuggestions: {
                  $unset: [newFriend._id],
                },
              },
            });
          },
        },
      }),
    }),
  }),
)(Friends);
