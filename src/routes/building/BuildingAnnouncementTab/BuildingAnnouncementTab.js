import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { graphql, compose } from 'react-apollo';
import update from 'immutability-helper';
import { Panel } from 'react-bootstrap';
import deleteBuildingAnnouncementMutation from './deleteBuildingAnnouncementMutation.graphql';
import updateBuildingAnnouncementMutation from './updateBuildingAnnouncementMutation.graphql';
import BuildingAnnouncementList, {
  BuildingAnnouncementItem,
} from '../../../components/BuildingAnnouncementList';
import NewAnnouncement from '../NewAnnouncement';
import DeleteBuildingAnnouncementModal from '../DeleteBuildingAnnouncementModal';
import EditBuildingAnnouncementModal from '../EditBuildingAnnouncementModal';
import s from './BuildingAnnouncementTab.scss';

class BuildingAnnouncementTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDeleteAnnouncement: false,
      showEditAnnouncement: false,
      idDeleteAnnouncemen: null,
      idEditAnnouncement: null,
      announcementType: null,
      announcementMessage: null,
    };
  }

  onClickDeleteModal = (evt) => {
    evt.preventDefault();
    this.props.deleteBuildingAnnouncement(this.state.idDeleteAnnouncemen)
    .then(({ data }) => {
      this.closeModal();
      this.setState(() => ({
        idDeleteAnnouncemen: null,
      }));
    }).catch((error) => {
      console.log('there was an error sending the query', error);
    });
  }

  onClickEditModal = (message) => {
    this.props.updateBuildingAnnouncement(
      this.state.idEditAnnouncement,
      message,
    )
    .then(({ data }) => {
      this.closeModal();
      this.setState(() => ({
        idEditAnnouncement: null,
      }));
    }).catch((error) => {
      console.log('there was an error sending the query', error);
    });
  }

  closeModal = () => {
    const { idDeleteAnnouncemen, idEditAnnouncement } = this.state;
    if (idDeleteAnnouncemen) {
      this.setState(() => ({
        showDeleteAnnouncement: false,
      }));
    }
    if (idEditAnnouncement) {
      this.setState(() => ({
        showEditAnnouncement: false,
      }));
    }
  }
  deleteAnnouncement = (id, message) => {
    this.setState(() => ({
      showDeleteAnnouncement: true,
      idDeleteAnnouncemen: id,
      announcementMessage: message,
    }));
  }

  editAnnouncement = (id, message) => {
    this.setState(() => ({
      showEditAnnouncement: true,
      idEditAnnouncement: id,
      announcementMessage: message,
    }));
  }
  render() {
    const {
      building,
      loadBuildingQuery,
    } = this.props;
    return (
      <div>
        <Panel>
          <NewAnnouncement
            buildingId={building._id}
            query={loadBuildingQuery}
            param={{
              buildingId: building._id,
              limit: 1000,
            }}
          />
        </Panel>
        <BuildingAnnouncementList buildingId={building._id}>
          {
            building && building.announcements && building.announcements.edges.map((a) => {
              let newMessage = null;
              const oldMessageLength = a.message.length;
              if (oldMessageLength > 52) {
                newMessage = a.message.slice(0, 51).concat('...');
                return (
                  <BuildingAnnouncementItem
                    key={a._id}
                    data={a}
                    message={newMessage}
                    onDelete={this.deleteAnnouncement}
                    onEdit={this.editAnnouncement}
                    displayAction
                  />
                );
              }
              return (
                <BuildingAnnouncementItem
                  key={a._id}
                  data={a}
                  message={a.message}
                  onDelete={this.deleteAnnouncement}
                  onEdit={this.editAnnouncement}
                  displayAction
                />
              );
            })
          }
        </BuildingAnnouncementList>
        <DeleteBuildingAnnouncementModal
          message={this.state.announcementMessage}
          show={this.state.showDeleteAnnouncement}
          closeModal={this.closeModal}
          clickModal={this.onClickDeleteModal}
        />
        <EditBuildingAnnouncementModal
          message={this.state.announcementMessage}
          show={this.state.showEditAnnouncement}
          closeModal={this.closeModal}
          clickModal={this.onClickEditModal}
        />
      </div>
    );
  }
}

BuildingAnnouncementTab.propTypes = {
  building: PropTypes.object.isRequired,
  loadBuildingQuery: PropTypes.object.isRequired,
  deleteBuildingAnnouncement: PropTypes.func.isRequired,
  updateBuildingAnnouncement: PropTypes.func.isRequired,
};

export default compose(
  withStyles(s),
  graphql(deleteBuildingAnnouncementMutation, {
    props: ({ ownProps, mutate }) => ({
      deleteBuildingAnnouncement: announcementId => mutate({
        variables: {
          input: {
            buildingId: ownProps.building._id,
            announcementId,
          },
        },
        optimisticResponse: {
          __typename: 'Mutation',
          deleteBuildingAnnouncement: {
            __typename: 'DeleteBuildingAnnouncementPayload',
            announcement: {
              __typename: 'BuildingAnnouncement',
              _id: announcementId,
            },
          },
        },
        update: (store, { data: { deleteBuildingAnnouncement } }) => {
          // Read the data from our cache for this query.
          let data = store.readQuery({
            query: ownProps.loadBuildingQuery,
            variables: ownProps.param,
          });
          const announcement = deleteBuildingAnnouncement.announcement;
          data = update(data, {
            building: {
              announcements: {
                edges: {
                  $unset: [announcement._id],
                },
              },
            },
          });
          // Write our data back to the cache.
          store.writeQuery({
            query: ownProps.loadBuildingQuery,
            variables: ownProps.param,
            data,
          });
        },
      }),
    }),
  }),
  graphql(updateBuildingAnnouncementMutation, {
    props: ({ ownProps, mutate }) => ({
      updateBuildingAnnouncement: (announcementId, message) => mutate({
        variables: {
          input: {
            buildingId: ownProps.building._id,
            announcementId,
            announcementInput: {
              message,
            },
          },
        },
      }),
    }),
  }),
)(BuildingAnnouncementTab);
