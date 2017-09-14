import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Grid, Row, Col } from 'react-bootstrap';
import MediaQuery from 'react-responsive';
import * as _ from 'lodash';
import Loading from '../../../components/Loading';
import inviteResidentsJoinEvent from './inviteResidentsJoinEvent.graphql';
import joinEvent from './joinEvent.graphql';
import canJoinEvent from './canJoinEvent.graphql';
import cantJoinEvent from './cantJoinEvent.graphql';
import deleteEvent from './deleteEvent.graphql';
import editEventMutation from './editEventMutation.graphql';
import fetchEventDetails from './fetchEventDetails.graphql';
import {
  EventMenu,
  EventDetail,
  InviteFriendToEventModal,
  InviteResidentToEventModal,
} from '../../../components/EventsComponents';
import interestEvent from '../../../components/EventsComponents/EventList/interestEvent.graphql';
import s from './EventDetailPage.scss';

class EventDetailPage extends Component {
  state= {
    loading: false,
    showModalInvite: false,
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

  invitationEventModal = ({
    building,
    ignoreFriends,
    invitedFriends,
    user,
  }) => {
    if (building) {
      if (!user.isAdmin) {
        return null;
      }
      return (<InviteResidentToEventModal
        show={this.state.showModalInvite}
        ignoreFriends={ignoreFriends}
        invitedFriends={invitedFriends}
        building={building}
        closeModal={this.closeModal}
        sendInvitation={this.onSendInviteClicked}
        user={user}
      />);
    }
    return (<InviteFriendToEventModal
      show={this.state.showModalInvite}
      ignoreFriends={ignoreFriends}
      invitedFriends={invitedFriends}
      closeModal={this.closeModal}
      sendInvitation={this.onSendInviteClicked}
      user={user}
    />);
  }

  render() {
    const {
      data: {
        loading,
        event,
      },
      user,
    } = this.props;

    // Show loading
    if (loading) {
      return <Loading show={loading} full>Đang tải ...</Loading>;
    }

    // Hide all invited users.
    const ignoreFriends = [user.id];
    _.concat(event.joins, event.can_joins, event.cant_joins).forEach(u => ignoreFriends.push(u._id));
    return (
      <Grid>
        {this.invitationEventModal({
          building: event.building ? event.building._id : undefined,
          invitedFriends: Array.isArray(event.invites) ? event.invites : [],
          ignoreFriends,
          user,
        })}
        <Loading show={loading} full>Đang tải ...</Loading>
        <Row className={s.containerTop30}>
          <MediaQuery minDeviceWidth={992} values={{ deviceWidth: 1600 }}>
            <Col md={3} smHidden xsHidden>
              <EventMenu />
            </Col>
          </MediaQuery>
          <Col md={9} sm={12} xs={12}>
            <EventDetail
              onOpenInviteModal={this.onOpenInviteModal}
              event={event}
              user={this.props.user}
              joinEvent={this.props.joinEvent}
              canJoinEvent={this.props.canJoinEvent}
              cantJoinEvent={this.props.cantJoinEvent}
              deleteEvent={this.props.deleteEvent}
              editEvent={this.props.editEvent}
              interestEvent={this.props.interestEvent}
            />
          </Col>
        </Row>
      </Grid>
    );
  }
}

EventDetailPage.propTypes = {
  data: PropTypes.shape({
    event: PropTypes.shape({
      _id: PropTypes.string,
      interests: PropTypes.array,
      joins: PropTypes.array,
      can_joins: PropTypes.array,
      cant_joins: PropTypes.array,
      invites: PropTypes.array,
    }),
    loading: PropTypes.bool,
  }).isRequired,
  inviteResidentsJoinEvent: PropTypes.func.isRequired,
  joinEvent: PropTypes.func.isRequired,
  canJoinEvent: PropTypes.func.isRequired,
  cantJoinEvent: PropTypes.func.isRequired,
  deleteEvent: PropTypes.func.isRequired,
  editEvent: PropTypes.func.isRequired,
  interestEvent: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

export default compose(
  withStyles(s),
  connect(state => ({
    user: state.user,
  })),
  graphql(fetchEventDetails, {
    options: props => ({
      variables: {
        eventId: props.eventId,
      },
    }),
    props: ({ data }) => ({
      data,
    }),
  }),
  graphql(deleteEvent, {
    props: ({ mutate }) => ({
      deleteEvent: eventId => mutate({
        variables: {
          eventId,
        },
      }),
    }),
  }),
  graphql(editEventMutation, {
    props: ({ mutate }) => ({
      editEvent: (_id, data) => mutate({
        variables: {
          input: {
            _id,
            ...data,
          },
        },
      }),
    }),
  }),
  graphql(joinEvent, {
    props: ({ mutate }) => ({
      joinEvent: (eventId, newInvitesList, newJoinList) => mutate({
        variables: {
          eventId,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          joinEvent: {
            _id: eventId,
            __typename: 'Event',
            invites: newInvitesList,
            joins: newJoinList,
            can_joins: [],
            cant_joins: [],
            interests: [],
          },
        },
      }),
    }),
  }),
  graphql(canJoinEvent, {
    props: ({ mutate }) => ({
      canJoinEvent: (eventId, newInvitesList, newJoinList) => mutate({
        variables: {
          eventId,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          canJoinEvent: {
            _id: eventId,
            __typename: 'Event',
            invites: newInvitesList,
            joins: [],
            can_joins: newJoinList,
            cant_joins: [],
            interests: [],
          },
        },
      }),
    }),
  }),
  graphql(cantJoinEvent, {
    props: ({ mutate }) => ({
      cantJoinEvent: (eventId, newInvitesList, newJoinList) => mutate({
        variables: {
          eventId,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          cantJoinEvent: {
            _id: eventId,
            __typename: 'Event',
            invites: newInvitesList,
            joins: [],
            can_joins: [],
            cant_joins: newJoinList,
            interests: [],
          },
        },
      }),
    }),
  }),
  graphql(inviteResidentsJoinEvent, {
    props: ({ mutate }) => ({
      inviteResidentsJoinEvent: (eventId, residentsId) => mutate({
        variables: {
          eventId,
          residentsId,
        },
      }),
    }),
  }),
  graphql(interestEvent, {
    props: ({ mutate }) => ({
      interestEvent: eventId => mutate({
        variables: {
          eventId,
        },
      }),
    }),
  }),
)(EventDetailPage);

