import React, { Component, PropTypes } from 'react';
import { graphql, compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Grid, Row, Col } from 'react-bootstrap';
import gql from 'graphql-tag';
import MediaQuery from 'react-responsive';
import Loading from '../../../components/Loading';
import {
  EventMenu,
  EventDetail,
} from '../../../components/EventsComponents';
import s from './EventDetailPage.scss';

const eventDetailQuery = gql`query eventDetailQuery ($eventId: String!) {
  event (_id: $eventId) {
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
    building {
      _id
      name
    }
    photos
    name
    location
    start
    end
    message
    invites {
      edges {
        _id
        username
        profile {
          picture
          firstName
          lastName
        }
      }
      pageInfo{
        hasNextPage
        total
        limit
        endCursor
      }
    }
    joins {
      edges {
        _id
        username
        profile {
          picture
          firstName
          lastName
        }
      }
      pageInfo{
        hasNextPage
        total
        limit
        endCursor
      }
    }
    interests {
      edges {
        _id
        username
        profile {
          picture
          firstName
          lastName
        }
      }
      pageInfo{
        hasNextPage
        total
        limit
        endCursor
      }
    }
    createdAt
    updatedAt
    isAuthor
  }
}`;

class EventDetailPage extends Component {
  state= {
    loading: false,
  }
  onCreateEvent = () => {

  }
  render() {
    const { loading } = this.state;
    const { data } = this.props;
    return (
      <Grid>
        <Loading show={loading} full>Đang tải ...</Loading>
        <Row className={s.containerTop30}>
          <MediaQuery minDeviceWidth={992} values={{ deviceWidth: 1600 }}>
            <Col md={3} smHidden xsHidden>
              <EventMenu
                onCreateEvent={this.onCreateEvent}
              />
            </Col>
          </MediaQuery>
          <Col md={9} sm={12} xs={12}>
            <EventDetail event={data.event} />
          </Col>
        </Row>
      </Grid>
    );
  }
}

EventDetailPage.propTypes = {
  data: PropTypes.shape({
    event: PropTypes.shape({
      interests: PropTypes.array,
      joins: PropTypes.array,
      invites: PropTypes.array,
    }),
    loading: PropTypes.bool.isRequired,
  }).isRequired,
};

export default compose(
  withStyles(s),
  graphql(eventDetailQuery, {
    options: props => ({
      variables: {
        eventId: props.eventId,
      },
    }),
    props: ({ data }) => ({
      data,
    }),
  }),
)(EventDetailPage);

