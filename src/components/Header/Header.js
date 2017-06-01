/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

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

update.extend('$unset', (_idsToRemove, original) => original.filter(v => _idsToRemove.indexOf(v._id) === -1));

const UserView = gql`
  fragment UserView on User {
    _id,
    username,
    profile {
      picture,
      firstName,
      lastName
    }
  }
`;

const userFragment = gql`
  fragment HeaderUserView on Me {
    ...UserView,
    totalNotification
    friends {
      ...UserView,
    }
    friendRequests {
      ...UserView,
    }
    friendSuggestions {
      ...UserView,
    }
  }
  ${UserView}
`;

const NotifyFragment = gql`
  fragment NotificationView on Notification {
    _id
    user {
      ...UserView,
    }
    type
    seen
    subject {
      _id
      message
      user {
        ...UserView,
      }
    }
    actors {
      ...UserView,
    }
    isRead
    createdAt
  }
  ${UserView}
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
    ...HeaderUserView,
  },
}
${userFragment}
${NotifyFragment}
`;

const friendAction = gql`mutation friendAction ($userId: String!, $cmd: String!) {
  friendAction(userId: $userId, cmd: $cmd) {
    _id,
  }
}`;

const updateSeenQuery = gql`mutation updateSeen {
  UpdateSeen {
    ...NotificationView
  }
}
${NotifyFragment}`;

const updateIsReadQuery = gql`mutation updateIsRead ($_id: String!) {
  UpdateIsRead(_id: $_id) {
    ...NotificationView
  }
}${NotifyFragment}`;

class Header extends React.Component {

  gotoHomePage =() => {
    history.push('/');
  }

  render() {
    const { data: { notifications, me, refetch }, loadMoreRows, updateSeen, updateIsRead, handleFriendAction } = this.props;
    return (
      <div className={s.root} >
        <Grid>
          <Row>
            <Col md={6} sm={6} xs={6}>
              <Button onClick={this.gotoHomePage} bsStyle="danger">HX</Button>
              <MediaQuery query="(min-width: 992px)">
                <SearchBox />
              </MediaQuery>
              <MediaQuery query="(max-width: 992px)">
                <SearchBox isMobile />
              </MediaQuery>
            </Col>
            <Col md={6} sm={6} xs={6}>
              <NavRight user={me} />
              <MediaQuery query="(min-width: 992px)">
                <Navigation
                  user={me}
                  data={notifications}
                  loadMoreRows={loadMoreRows}
                  updateSeen={updateSeen}
                  updateIsRead={updateIsRead}
                  refetch={refetch}
                  friendType={PENDING}
                  friends={me.friendRequests}
                  handleFriendAction={handleFriendAction}
                />
              </MediaQuery>
            </Col>
          </Row>
          <MediaQuery query="(max-width: 992px)">
            <div className={s.boxMobileHeader}>
              <Navigation
                user={me}
                data={notifications}
                loadMoreRows={loadMoreRows}
                updateSeen={updateSeen}
                updateIsRead={updateIsRead}
                refetch={refetch}
                friendType={PENDING}
                friends={me.friendRequests}
                handleFriendAction={handleFriendAction}
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
  }).isRequired,
  loadMoreRows: PropTypes.func.isRequired,
  updateSeen: PropTypes.func.isRequired,
  updateIsRead: PropTypes.func.isRequired,
  handleFriendAction: PropTypes.func.isRequired,
};

Header.defaultProps = {
  data: {},
};

export default compose(
  withStyles(s),
  graphql(headerQuery, {
    options: () => ({
      // variables: {},
      pollInterval: 30000,
    }),
    props: ({ data }) => {
      const { fetchMore } = data;
      const loadMoreRows = () => fetchMore({
        variables: {
          cursor: data.notifications.pageInfo.endCursor,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newEdges = fetchMoreResult.notifications.edges;
          const pageInfo = fetchMoreResult.notifications.pageInfo;
          return {
            notifications: {
              edges: [...previousResult.notifications.edges, ...newEdges],
              pageInfo,
            },
          };
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
  graphql(updateIsReadQuery, {
    props: ({ mutate }) => ({
      updateIsRead: _id => mutate({
        variables: { _id },
        updateQueries: {
          headerQuery: (previousResult, { mutationResult }) => {
            const result = mutationResult.data.UpdateIsRead;
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
  graphql(friendAction, {
    props: ({ mutate }) => ({
      handleFriendAction: (userId, cmd) => mutate({
        variables: { userId, cmd },
        updateQueries: {
          headerQuery: (previousResult, { mutationResult }) => {
            const newFriend = mutationResult.data.friendAction;
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
