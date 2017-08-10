import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Grid, Row, Col, Button } from 'react-bootstrap';
import MediaQuery from 'react-responsive';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import update from 'immutability-helper';

import SearchBox from '../SearchBox';
import Navigation from '../Navigation';
import NavRight from '../NavRight';
import history from '../../core/history';
import s from './Header.scss';

import { PENDING } from '../../constants';
// import logoUrl from './logo-small.png';
// import logoUrl2x from './logo-small@2x.png';

const userFragment = gql`
  fragment HeaderUserView on Me {
    friends {
      _id
      username
      profile {
        picture
        firstName
        lastName
      }
    }
    friendRequests {
      _id
      username
      profile {
        picture
        firstName
        lastName
      }
    }
    friendSuggestions {
      _id
      username
      profile {
        picture
        firstName
        lastName
      }
    }
    building {
      _id
    }
  }
`;

const NotifyFragment = gql`
  fragment NotificationView on Notification {
    _id
    user {
      _id
      username
      profile {
        picture
        firstName
        lastName
      }
    }
    type
    seen
    subject {
      _id
      message
      user {
        _id
        username
        profile {
          picture
          firstName
          lastName
        }
      }
    }
    actors {
      _id
      username
      profile {
        picture
        firstName
        lastName
      }
    }
    isRead
    createdAt
  }
`;

const headerQuery = gql`query headerQuery($cursor: String) {
  notifications (cursor: $cursor, limit: 6) {
    edges {
      ...NotificationView
    }
    pageInfo {
      endCursor,
      hasNextPage
    }
  }
  me {
     _id
    username
    profile {
      picture
      firstName
      lastName
    }
    totalNotification
    ...HeaderUserView
  },
}
${userFragment}
${NotifyFragment}
`;

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

const updateSeenQuery = gql`mutation updateSeen {
  updateSeen {
    response
  }
}`;

const updateReadQuery = gql`mutation updateRead ($_id: String!) {
  updateRead(_id: $_id) {
    ...NotificationView
  }
}${NotifyFragment}`;

class Header extends React.Component {

  gotoHomePage =() => {
    history.push('/');
  }

  render() {
    const {
      data: { notifications, me, refetch },
      loadMoreRows,
      updateSeen,
      updateRead,
      rejectFriendAction,
      acceptFriendAction,
    } = this.props;
    const user = me || {};
    return (
      <div className={s.root} >
        <Grid>
          <Row>
            <Col md={6} sm={6} xs={6}>
              <Button title="Trang chủ" onClick={this.gotoHomePage} bsStyle="danger">HX</Button>
              <MediaQuery query="(min-width: 992px)">
                <SearchBox />
              </MediaQuery>
              <MediaQuery query="(max-width: 992px)">
                <SearchBox isMobile />
              </MediaQuery>
            </Col>
            <Col md={6} sm={6} xs={6}>
              <NavRight user={user} />
              <MediaQuery query="(min-width: 992px)">
                <Navigation
                  user={user}
                  data={notifications}
                  loadMoreRows={loadMoreRows}
                  updateSeen={updateSeen}
                  updateIsRead={updateRead}
                  refetch={refetch}
                  friendType={PENDING}
                  friends={user.friendRequests || []}
                  rejectFriendAction={rejectFriendAction}
                  acceptFriendAction={acceptFriendAction}
                />
              </MediaQuery>
            </Col>
          </Row>
          <MediaQuery query="(max-width: 992px)">
            <div className={s.boxMobileHeader}>
              <Navigation
                user={user}
                data={notifications}
                loadMoreRows={loadMoreRows}
                updateSeen={updateSeen}
                updateIsRead={updateRead}
                refetch={refetch}
                friendType={PENDING}
                friends={user.friendRequests || []}
                rejectFriendAction={rejectFriendAction}
                acceptFriendAction={acceptFriendAction}
                isMobile
              />
            </div>
          </MediaQuery>
        </Grid>
      </div>
    );
  }
}

Header.propTypes = {
  data: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    me: PropTypes.object,
  }).isRequired,
  loadMoreRows: PropTypes.func.isRequired,
  updateSeen: PropTypes.func.isRequired,
  updateRead: PropTypes.func.isRequired,
  rejectFriendAction: PropTypes.func.isRequired,
  acceptFriendAction: PropTypes.func.isRequired,
};

Header.defaultProps = {
  data: {
    me: {},
  },
};

export default compose(
  withStyles(s),
  graphql(headerQuery, {
    options: () => ({
      variables: {},
      // pollInterval: 30000,
    }),
    props: ({ data }) => {
      const { fetchMore } = data;
      const loadMoreRows = () => fetchMore({
        variables: {
          cursor: data.notifications.pageInfo.endCursor,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) { 
            return;
          }
          return update(previousResult, {
            notifications: {
              edges: {
                $unshift: fetchMoreResult.notifications.edges,
              },
              pageInfo: {
                $set: fetchMoreResult.notifications.pageInfo,
              },
            },
          });
        },
      });
      return {
        data,
        loadMoreRows,
      };
    },
  }),
  graphql(updateSeenQuery, {
    props: ({ mutate }) => ({
      updateSeen: () => mutate({
        variables: {},
        updateQueries: {
          headerQuery: previousResult => update(previousResult, {
            me: {
              totalNotification: { $set: 0 },
            },
          }),
        },
      }),
    }),
  }),
  graphql(updateReadQuery, {
    props: ({ mutate }) => ({
      updateRead: _id => mutate({
        variables: { _id },
        updateQueries: {
          headerQuery: (previousResult, { mutationResult: { data } }) => {
            if (!data) {
              return;
            }
            const result = data.updateRead;
            const index = previousResult.notifications.edges.findIndex(item => item._id === result._id);
            return update(previousResult, {
              notifications: {
                edges: {
                  $splice: [[index, 1, result]],
                },
              },
            });
          },
        },
      }),
    }),
  }),
  // friendAction
  graphql(acceptFriend, {
    props: ({ mutate }) => ({
      acceptFriendAction: userId => mutate({
        variables: { userId },
        updateQueries: {
          headerQuery: (previousResult, { mutationResult }) => {
            if (!mutationResult) {
              return;
            }
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
          headerQuery: (previousResult, { mutationResult }) => {
            if (!mutationResult) {
              return;
            }
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
)(Header);
