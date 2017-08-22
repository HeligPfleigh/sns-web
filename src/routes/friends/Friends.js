import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import update from 'immutability-helper';
import { Grid, Row, Col } from 'react-bootstrap';
import Loading from '../../components/Loading';
import Label from '../../components/Friend/Label';
import FriendSuggestions from '../FriendSuggestions';
import FriendsList, { FriendActionItem } from '../../components/FriendsList';
import acceptFriend from './acceptFriendMutation.graphql';
import rejectFriend from './rejectFriendMutation.graphql';
import s from './Friends.scss';

const friendsPageQuery = gql`query friendsPageQuery {
  me {
    _id
    profile {
      picture
      firstName
      lastName
    }
    friendRequests {
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
});

class Friends extends Component {

  render() {
    const {
      data: { loading, me },
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
                <li style={{ paddingLeft: '10px' }}>
                  <Label label={`Bạn có ${me.friendRequests.length} yêu cầu kết bạn`} />
                </li>
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
            <FriendSuggestions />
          </Col>
        </Row>
      </Grid>
    );
  }
}

Friends.propTypes = {
  acceptFriendAction: PropTypes.func.isRequired,
  rejectFriendAction: PropTypes.func.isRequired,
  data: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    refetch: PropTypes.func.isRequired,
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
)(Friends);
