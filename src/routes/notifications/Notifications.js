/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component, PropTypes } from 'react';
import { graphql, compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Grid, Row, Col } from 'react-bootstrap';
import gql from 'graphql-tag';
import MediaQuery from 'react-responsive';
import InfiniteScroll from 'react-infinite-scroller';
import FriendSuggestions from '../../components/FriendSuggestions';
import { NotificationList } from '../../components/Notification';
import Loading from '../../components/Loading';
import s from './Notifications.scss';

const userFragment = gql`
  fragment userNotificationView on UserSchemas {
    _id,
    username,
    profile {
      picture,
      firstName,
      lastName
    }
    totalNotification
  }
`;

const notificationFragment = gql`
  fragment frmNotificationView on NotificationSchemas {
    _id
    user {
      ...userNotificationView
    }
    type
    seen
    subject {
      _id
      message
      user {
        ...userNotificationView
      }
    }
    actors {
      ...userNotificationView
    }
    isRead
    createdAt
  }
  ${userFragment}
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
    ...userNotificationView,
  },
}
${userFragment}
${notificationFragment}`;

const updateIsReadQuery = gql`mutation updateIsRead ($_id: String!) {
  UpdateIsRead(_id: $_id) {
    _id
  }
}`;

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
    options: () => ({}),
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
  graphql(updateIsReadQuery, {
    props: ({ mutate }) => ({
      updateIsRead: _id => mutate({
        variables: { _id },
      }),
    }),
  }),
)(Notifications);
