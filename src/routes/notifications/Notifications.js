/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Grid, Row, Col } from 'react-bootstrap';
import gql from 'graphql-tag';
import MediaQuery from 'react-responsive';
import InfiniteScroll from 'react-infinite-scroller';
import update from 'immutability-helper';

import FriendSuggestions from '../FriendSuggestions';
import { NotificationList } from '../../components/Notification';
import Loading from '../../components/Loading';
import s from './Notifications.scss';

// const userFragment = gql`
//   fragment userNotificationView on Author {
//     _id,
//     username,
//     profile {
//       picture,
//       firstName,
//       lastName
//     }
//   }
// `;

const notificationFragment = gql`
  fragment frmNotificationView on Notification {
    _id
    user {
      _id,
      username,
      profile {
        picture,
        firstName,
        lastName
      }
    }
    data {
      text
      month
      year
      apartment
    }
    type
    seen
    subject {
      _id
      message
      user {
        _id,
        username,
        profile {
          picture,
          firstName,
          lastName
        }
      }
    }
    actors {
      _id,
      username,
      profile {
        picture,
        firstName,
        lastName
      }
    }
    isRead
    createdAt
  }
`;

const notificationQuery = gql`query notificationQuery($cursor: String) {
  notifications (cursor: $cursor) {
    edges {
      ...frmNotificationView
    }
    pageInfo {
      endCursor,
      hasNextPage
    }
  }
  me {
    _id,
    username,
    profile {
      picture,
      firstName,
      lastName
    }
    totalNotification
  },
}
${notificationFragment}`;

const updateIsReadQuery = gql`mutation updateRead ($_id: String!) {
  updateRead(_id: $_id) {
    ...frmNotificationView
  }
}${notificationFragment}`;

class Notifications extends Component {
  static propTypes = {
    data: PropTypes.shape({
      notifications: PropTypes.object,
      loading: PropTypes.bool.isRequired,
    }).isRequired,
    loadMoreRows: PropTypes.func.isRequired,
    updateIsRead: PropTypes.func.isRequired,
  };

  render() {
    const { data: { loading, notifications, me }, loadMoreRows, updateIsRead } = this.props;
    let hasNextPage = false;
    if (!loading && notifications && notifications.pageInfo) {
      hasNextPage = notifications.pageInfo.hasNextPage;
    }
    return (
      <Grid>
        <Loading show={loading} full>Loading ...</Loading>
        <Row className={s.containerTop30}>
          <Col md={8} sm={12} xs={12}>
            {/**
            <InfiniteScroll
              loadMore={loadMoreRows}
              hasMore={hasNextPage}
              loader={<div className="loader">Loading ...</div>}
            >
              { notifications && notifications.edges && <NotificationList
                notifications={notifications ? notifications.edges : []}
                userInfo={me}
                updateIsRead={updateIsRead}
              />}
            </InfiniteScroll>
            */}
            { notifications && notifications.edges && <NotificationList
              notifications={notifications ? notifications.edges : []}
              userInfo={me}
              updateIsRead={updateIsRead}
            />}
          </Col>

          <MediaQuery minDeviceWidth={992} values={{ deviceWidth: 1600 }}>
            <Col md={4} smHidden xsHidden>
              <FriendSuggestions />
            </Col>
          </MediaQuery>
        </Row>
      </Grid>
    );
  }
}

export default compose(
  withStyles(s),
  graphql(notificationQuery, {
    options: () => ({
      variables: {
        cursor: null,
      },
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
  graphql(updateIsReadQuery, {
    options: () => ({
      pollInterval: 30000,
    }),
    props: ({ mutate }) => ({
      updateIsRead: _id => mutate({
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
)(Notifications);
