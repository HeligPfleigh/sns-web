import React, { PropTypes } from 'react';
import { graphql, compose } from 'react-apollo';
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
import InfiniteScroll from 'react-infinite-scroller';

class EventList extends React.Component {
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
    } = this.props;

    let hasNextPage = false;
    if (!loading && listEvent && listEvent.pageInfo) {
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
              {
                listEvent && listEvent.edges && listEvent.edges.map(event => (
                  <EventItem
                    event={event}
                  />
                ))
              }
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
};


const listEventQuerys = gql`query ($limit: Int, $cusor: String){
  listEvent (limit: $limit, cursor: $cusor){
    edges {
      _id
      privacy
      isDeleted
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
    }
    pageInfo{
    	hasNextPage
      total
      limit
      endCursor
  	}
  }
}`;

export default compose(
  withStyles(s),
  graphql(listEventQuerys, {
    options: () => ({
      variables: {
        limit: 10,
      },
      fetchPolicy: 'network-only',
    }),
    props: ({ data }) => {
      const { fetchMore } = data;
      const loadMoreRows = throttle(() => {
        fetchMore({
          variables: {
            limit: 5,
            cursor: data.listEvent.pageInfo.endCursor,
          },
          fetchPolicy: 'network-only',
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

