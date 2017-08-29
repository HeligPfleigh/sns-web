import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Grid, Row, Col } from 'react-bootstrap';
import MediaQuery from 'react-responsive';
import throttle from 'lodash/throttle';
import update from 'immutability-helper';
import { Feed } from '../../../../components/Feed';
import Loading from '../../../../components/Loading';
import Menu from '../../Menu/Menu';
import s from './MemberManagement.scss';
import { ListUsersAwaitingApproval } from './UserAwaitingApprovalTab';

const loadUsersAwaitingApprovalQuery = gql`
query loadUsersAwaitingApprovalQuery ($buildingId: String!, $cursor: String, $limit: Int) {
  building (_id: $buildingId) {
    _id
    requests (cursor: $cursor, limit: $limit) {
      edges {
        ...UsersAwaitingApproval
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
}
${Feed.fragments.requests}`;

class MemberManagement extends Component {

  render() {
    const { data, loadMore, buildingId, user } = this.props;

    let building = {};
    if (data && data.building) {
      building = data.building;
    }

    if (data && data.loading) {
      return <Loading show={data.loading} full>Đang tải ...</Loading>;
    }

    return (
      <Grid>
        <Row className={s.containerTop30}>
          <MediaQuery minDeviceWidth={992} values={{ deviceWidth: 1600 }}>
            <Col md={3} smHidden xsHidden>
              <Menu
                user={user}
                parentPath={`/management/${buildingId}`}
                pageKey="resident_management>approve_member"
              />
            </Col>
          </MediaQuery>
          <Col md={9} sm={12} xs={12}>
            { building &&
              <ListUsersAwaitingApproval
                data={building.requests || []}
                loadMore={loadMore}
                loading={data && data.loading}
              />
            }
          </Col>
        </Row>
      </Grid>
    );
  }
}

MemberManagement.propTypes = {
  data: PropTypes.object,
  loadMore: PropTypes.func,
  user: PropTypes.object.isRequired,
  buildingId: PropTypes.string.isRequired,
};

export default compose(
  withStyles(s),
  connect(state => ({
    user: state.user,
  })),
  graphql(loadUsersAwaitingApprovalQuery, {
    options: props => ({
      variables: {
        buildingId: props.buildingId,
        limit: 4,
      },
    }),
    props: ({ data }) => {
      const { fetchMore } = data;
      const loadMore = throttle(() => fetchMore({
        query: loadUsersAwaitingApprovalQuery,
        variables: {
          buildingId: data.building._id,
          cursor: data.building.requests.pageInfo.endCursor,
          limit: 4,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return null;
          }
          return update(previousResult, {
            building: {
              requests: {
                edges: {
                  $push: fetchMoreResult.building.requests.edges,
                },
                pageInfo: {
                  $set: fetchMoreResult.building.requests.pageInfo,
                },
              },
            },
          });
        },
      }), 300);

      return {
        data,
        loadMore,
      };
    },
  }),
)(MemberManagement);
