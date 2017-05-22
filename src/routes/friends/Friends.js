import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import update from 'immutability-helper';
import { Grid, Row, Col } from 'react-bootstrap';
import Loading from '../../components/Loading';
import FriendList from '../../components/Friend/FriendList';
import Friend from '../../components/Friend/Friend';
import { PENDING, NONE, ACCEPTED, REJECTED } from '../../constants';
import s from './Friends.scss';
import Label from '../../components/Friend/Label';

const friendsPageQuery = gql`query friendsPageQuery {
  me {
    _id,
    username,
    profile {
      picture,
      firstName,
      lastName
    }
    friends {
      _id
      profile {
        picture,
        firstName,
        lastName
      }
    }
    friendRequests {
      _id
      profile {
        picture,
        firstName,
        lastName
      }
    }
    friendSuggestions {
      _id
      profile {
        picture,
        firstName,
        lastName
      }
    }
  }
}
`;

const friendAction = gql`mutation friendAction ($userId: String!, $cmd: String!) {
  friendAction(userId: $userId, cmd: $cmd) {
    _id,
  }
}`;

@graphql(friendsPageQuery)
@graphql(friendAction, { name: 'friendAction' })
class Friends extends React.Component {
  static propTypes = {
    friendAction: PropTypes.func.isRequired,
    data: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
    }).isRequired,
  }
  constructor() {
    super();
    update.extend('$unset', (_idsToRemove, original) => original.filter(v => _idsToRemove.indexOf(v._id) === -1));
  }
  handleFriendAction = (userId, cmd) => {
    this.props.friendAction({
      variables: { userId, cmd },
      ...cmd === PENDING && {
        refetchQueries: [{
          query: friendsPageQuery,
        }],
      },
      ...(cmd === ACCEPTED || cmd === REJECTED) && {
        updateQueries: {
          friendsPageQuery: (previousResult, { mutationResult }) => {
            const newFriend = mutationResult.data.friendAction;
            return update(previousResult, {
              me: {
                friends: {
                  $unshift: [newFriend],
                },
                friendRequests: {
                  $unset: [newFriend._id],
                },
              },
            });
          },
        },
      },
    });
  }
  render() {
    const { data: { loading, me } } = this.props;
    return (

      <Grid>
        <Loading show={loading} full />
        <Row className={s.containerTop30}>
          <Col md={8} xs={12}>
            {
              me && me.friendRequests &&
              <FriendList>
                <Label label={`Respond to Your ${me.friendRequests.length} Friend Requests`}></Label>
                {
                  me.friendRequests.map(friend =>
                    <Friend friend={friend} handleFriendAction={this.handleFriendAction} friendType={PENDING} />
                  )
                }
              </FriendList>
            }
          </Col>
          <Col md={4} xs={12}>
            {
              me && me.friendSuggestions && me.friendSuggestions.length > 0 &&
              <FriendList>
                {
                  me.friendSuggestions.map(friend =>
                    <li key={friend._id}>
                      <Friend friend={friend} handleFriendAction={this.handleFriendAction} friendType={NONE} />
                    </li>
                  )
                }
              </FriendList>
            }
          </Col>
        </Row>
      </Grid>


    );
  }
}

export default withStyles(s)(Friends);
