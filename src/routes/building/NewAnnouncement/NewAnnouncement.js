import React, { Component } from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import { reset } from 'redux-form';
import { generate as idRandom } from 'shortid';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import NewAnnouncementForm from './NewAnnouncementForm';
import {
  TYPE1,
} from '../../../constants';
import { openAlertGlobal } from '../../../reducers/alert';
import createNewBuildingAnnouncementMutation from './createNewBuildingAnnouncementMutation.graphql';
import s from './NewAnnouncement.scss';

class NewAnnouncement extends Component {

  submit = (values) => {
    const {
      type = TYPE1,
      message,
    } = values;
    this.props.createNewBuildingAnnouncement(type, message)
    .then(({ data }) => {
      console.log('got data', data);
      this.props.resetForm();
      this.props.openAlertGlobalAction({
        message: 'Bạn đã đăng thông báo thành công',
        open: true,
        autoHideDuration: 0,
      });
    }).catch((error) => {
      console.log('there was an error sending the query', error);
    });
  }

  render() {
    return (
      <NewAnnouncementForm
        onSubmit={this.submit}
      />
    );
  }
}

NewAnnouncement.propTypes = {
  createNewBuildingAnnouncement: PropTypes.func.isRequired,
  buildingId: PropTypes.string.isRequired,
  openAlertGlobalAction: PropTypes.func,
  resetForm: PropTypes.func,
};

export default compose(
  withStyles(s),
  graphql(createNewBuildingAnnouncementMutation, {
    props: ({ ownProps, mutate }) => ({
      createNewBuildingAnnouncement: (type, message) => mutate({
        variables: {
          input: {
            buildingId: ownProps.buildingId,
            announcementInput: {
              type,
              message,
            },
          },
        },
        optimisticResponse: {
          __typename: 'Mutation',
          createNewBuildingAnnouncement: {
            __typename: 'CreateNewBuildingAnnouncementPayload',
            announcement: {
              __typename: 'BuildingAnnouncement',
              _id: idRandom(),
              message,
              type,
              date: (new Date()).toISOString(),
            },
          },
        },
        update: (store, { data: { createNewBuildingAnnouncement } }) => {
          // Read the data from our cache for this query.
          let data = store.readQuery({
            query: ownProps.query,
            variables: ownProps.param,
          });
          data = update(data, {
            building: {
              announcements: {
                edges: {
                  $unshift: [createNewBuildingAnnouncement.announcement],
                },
              },
            },
          });
          // Write our data back to the cache.
          store.writeQuery({
            query: ownProps.query,
            variables: ownProps.param,
            data,
          });
        },
      }),
    }),
  }),
)(connect(
  null,
  dispatch => ({
    openAlertGlobalAction: data => dispatch(openAlertGlobal(data)),
    resetForm: () => dispatch(reset('newAnnouncementForm')),
  }),
)(NewAnnouncement));
