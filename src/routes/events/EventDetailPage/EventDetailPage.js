import React, { Component, PropTypes } from 'react';
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Grid, Row, Col } from 'react-bootstrap';
import gql from 'graphql-tag';
import update from 'immutability-helper';
import MediaQuery from 'react-responsive';
import Loading from '../../../components/Loading';
import getFriendsQuery from '../../ChatSideBar/getFriendsQuery.graphql';
import inviteResidentsJoinEvent from './inviteResidentsJoinEvent.graphql';
import {
  EventMenu,
  EventDetail,
  InviteToEventModal,
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
      _id
      username
      profile {
        picture
        firstName
        lastName
      }
    }
    joins {
      _id
      username
      profile {
        picture
        firstName
        lastName
      }
    }
    interests {
      _id
      username
      profile {
        picture
        firstName
        lastName
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
    showModalInvite: false,
  }

  onCreateEvent = () => {

  }

  onOpenInviteModal = () => {
    if (!this.state.showModalInvite) {
      this.setState({
        showModalInvite: true,
      });
    }
  }

  onSendInviteClicked = (friendsSelected) => {
    this.props.inviteResidentsJoinEvent(this.props.data.event._id, friendsSelected);
  }

  closeModal = () => {
    if (this.state.showModalInvite) {
      this.setState({
        showModalInvite: false,
      });
    }
  }

  render() {
    const { loading } = this.state;
    const { data, friends } = this.props;
    return (
      <div>
        <InviteToEventModal
          show={this.state.showModalInvite}
          friends={friends}
          invites={data.event ? data.event.invites : []}
          closeModal={this.closeModal}
          onSendInviteClicked={this.onSendInviteClicked}
        />
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
              <EventDetail
                onOpenInviteModal={this.onOpenInviteModal}
                event={data.event}
                user={this.props.user}
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

EventDetailPage.propTypes = {
  data: PropTypes.shape({
    event: PropTypes.shape({
      _id: PropTypes.string,
      interests: PropTypes.array,
      joins: PropTypes.array,
      invites: PropTypes.array,
    }),
    loading: PropTypes.bool.isRequired,
  }).isRequired,
  friends: PropTypes.array.isRequired,
  inviteResidentsJoinEvent: PropTypes.any.isRequired,
  user: PropTypes.object.isRequired,
};

export default compose(
  withStyles(s),
  connect(state => ({
    user: state.user,
  })),
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
  graphql(getFriendsQuery, {
    props: ({ data }) => {
      const { me } = data;
      const friends = me ? me.friends : [];
      return {
        friends,
      };
    },
  }),
  graphql(inviteResidentsJoinEvent, {
    props: ({ mutate, ownProps: { friends } }) => ({
      inviteResidentsJoinEvent: (eventId, residentsId) => mutate({
        variables: {
          eventId,
          residentsId,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          inviteResidentsJoinEvent: {
            __typename: 'Event',
            invites: residentsId.map((id) => {
              friends.forEach((friend) => {
                if (friend._id === id) {
                  return friend;
                }
              });
            }),
          },
        },
        update: (store, { inviteResidentsJoinEvent }) => {
          // Read the data from our cache for this query.
          let data = store.readQuery({ query: inviteResidentsJoinEvent });
          data = update(data, {
            event: {
              invites: inviteResidentsJoinEvent.event.invites,
            },
          });
          // Write our data back to the cache.
          store.writeQuery({ query: inviteResidentsJoinEvent, data });
        },
      }),
    }),
  }),
)(EventDetailPage);

