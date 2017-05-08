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

import s from './Header.scss';
import SearchBox from '../SearchBox';
import Navigation from '../Navigation';
import NavRight from '../NavRight';
import history from '../../core/history';
// import logoUrl from './logo-small.png';
// import logoUrl2x from './logo-small@2x.png';

const userFragment = gql`
  fragment HeaderUserView on UserSchemas {
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

const NotifyFragment = gql`
  fragment NotificationView on NotificationSchemas {
    _id
    user {
      ...HeaderUserView
    }
    type
    seen
    subject {
      _id
      message
      user {
        ...HeaderUserView
      }
    }
    actors {
      ...HeaderUserView
    }
    isRead
    createdAt
  }
  ${userFragment}
`;

const headerQuery = gql`query headerQuery($cursor: String) {
  notifications (cursor: $cursor) {
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

class Header extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
    }).isRequired,
    loadMoreRows: PropTypes.func.isRequired,
  };

  gotoHomePage =() => {
    history.push('/');
  }

  render() {
    const { data: { notifications, me }, loadMoreRows } = this.props;
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
            <Col md={6} sm={6} xs={6} >
              <NavRight user={me} />
              <MediaQuery query="(min-width: 992px)">
                <Navigation user={me} data={notifications} loadMoreRows={loadMoreRows} />
              </MediaQuery>
            </Col>
          </Row>
          <MediaQuery query="(max-width: 992px)">
            <div className={s.boxMobileHeader}>
              <Navigation user={me} data={notifications} loadMoreRows={loadMoreRows} isMobile />
            </div>
          </MediaQuery>
        </Grid>
      </div>
    );
  }
}

export default compose(
  withStyles(s),
  graphql(headerQuery, {
    options: () => ({
      variables: {},
      // pollInterval: 20000,
    }),
    props: ({ data }) => {
      const { fetchMore } = data;
      const loadMoreRows = () => fetchMore({
        variables: {
          cursor: data.feeds.pageInfo.endCursor,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newEdges = fetchMoreResult.feeds.edges;
          const pageInfo = fetchMoreResult.feeds.pageInfo;
          return {
            feeds: {
              edges: [...previousResult.feeds.edges, ...newEdges],
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
)(Header);
