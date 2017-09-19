import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import InfiniteScroll from 'react-infinite-scroller';
import {
  Row,
  Col,
} from 'react-bootstrap';
import update from 'immutability-helper';
import throttle from 'lodash/throttle';
import gql from 'graphql-tag';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import s from './EventList.scss';
import EventItem from '../EventItem/EventItem';
import Loading from '../../../components/Loading';
import interestEvent from './interestEvent.graphql';
import disInterestEventMutation from './disInterestEventMutation.graphql';

class EventList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCreateEventModal: false,
    };
  }

  closeModal = () => {
    this.setState({
      showCreateEventModal: false,
    });
  }

  render() {
    const {
      data: {
        loading,
        listEvent,
      },
      loadMoreRows,
      user,
    } = this.props;

    // Show loading
    if (loading) {
      return <Loading show={loading} full>Đang tải ...</Loading>;
    }

    let hasNextPage = false;
    if (listEvent.pageInfo) {
      hasNextPage = listEvent.pageInfo.hasNextPage;
    }

    return (
      <div className={s.eventContentList}>
        <h4>Dòng sự kiện</h4>
        <Row>
          <Col md={12}>
            <InfiniteScroll
              loadMore={loadMoreRows}
              hasMore={hasNextPage}
              loader={<div className="loader">Đang tải ...</div>}
            >
              { listEvent.edges.map(event => <EventItem
                key={Math.random()}
                event={event}
                user={user}
                interestEvent={this.props.interestEvent}
                disInterestEvent={this.props.disInterestEvent}
              />) }
            </InfiniteScroll>
          </Col>
        </Row>
      </div>
    );
  }
}
EventList.propTypes = {
  data: PropTypes.shape({
    listEvent: PropTypes.object,
    loading: PropTypes.bool.isRequired,
  }).isRequired,
  loadMoreRows: PropTypes.func.isRequired,
  interestEvent: PropTypes.func.isRequired,
  disInterestEvent: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};


const listEventQuerys = gql`query ($limit: Int, $cursor: String){
  listEvent (limit: $limit, cursor: $cursor){
    edges {
      _id
      privacy
      author {
        _id
        username
        profile {
          picture
          firstName
          lastName
        }
      }
      photos
      name
      location
      start
      end
      message
      isCancelled
      isInterest
      interests {
        _id
        username
        profile {
          picture
          firstName
          lastName
        }
      }
    }
    pageInfo {
      hasNextPage
      total
      limit
      endCursor
    }
  }
}`;

export default compose(
  withStyles(s),
  graphql(interestEvent, {
    props: ({ mutate }) => ({
      interestEvent: eventId => mutate({
        variables: {
          eventId,
        },
      }),
    }),
  }),
  graphql(disInterestEventMutation, {
    props: ({ mutate }) => ({
      disInterestEvent: eventId => mutate({
        variables: {
          eventId,
        },
      }),
    }),
  }),
  graphql(listEventQuerys, {
    options: () => ({
      variables: {
        limit: 10,
        cursor: null,
      },
    }),
    props: ({ data }) => {
      const { fetchMore } = data;
      const loadMoreRows = throttle(() => {
        fetchMore({
          variables: {
            limit: 5,
            cursor: data.listEvent.pageInfo.endCursor,
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const newEdges = fetchMoreResult.listEvent.edges;
            const pageInfo = fetchMoreResult.listEvent.pageInfo;
            return update(previousResult, {
              listEvent: {
                edges: {
                  $push: newEdges,
                },
                pageInfo: {
                  $set: pageInfo,
                },
              },
            });
          },
        });
      }, 300);
      return {
        data,
        loadMoreRows,
      };
    },
  }),
)(EventList);

