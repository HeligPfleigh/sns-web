import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import update from 'immutability-helper';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Grid, Row, Col, Pagination } from 'react-bootstrap';
import MediaQuery from 'react-responsive';
import { initialize as initializeState } from 'redux-form';
import Loading from '../../../components/Loading';
import Menu from '../Menu/Menu';
import announcementsQuery from './graphql/announcementsQuery.graphql';
import {
  BuildingAnnouncementItem,
} from '../../../components/BuildingAnnouncementList';
import DeleteAnnouncementModal from './DeleteAnnouncementModal';
import EditAnnouncementModal from './EditAnnouncementModal';
import deleteAnnouncementMutation from './graphql/deleteAnnouncementMutation.graphql';
import editAnnouncementMutation from './graphql/editAnnouncementMutation.graphql';
import s from './style.scss';

const limit = 4;

class AnnouncementsManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      currentPage: 1,
      idDeleteAnnouncement: null,
      idEditAnnouncement: null,
      showDeleteAnnouncement: false,
      showEditAnnouncement: false,
    };
  }

  onClickDeleteModal = () => {
    const { idDeleteAnnouncement } = this.state;
    if (idDeleteAnnouncement) {
      this.props.deleteAnnouncement(idDeleteAnnouncement);
      this.closeModal();
    }
  }

  onClickEditModal = ({ message, description, privacy, apartments, date }) => {
    const { idEditAnnouncement } = this.state;
    if (idEditAnnouncement) {
      this.props.editAnnouncement(
        idEditAnnouncement,
        message,
        description,
        privacy,
        apartments,
        date,
      );
      this.closeModal();
    }
  }

  closeModal = () => {
    const { idDeleteAnnouncement, idEditAnnouncement } = this.state;
    if (idDeleteAnnouncement) {
      this.setState(() => ({
        showDeleteAnnouncement: false,
        idDeleteAnnouncement: null,
      }));
    }
    if (idEditAnnouncement) {
      this.setState(() => ({
        showEditAnnouncement: false,
        idEditAnnouncement: null,
      }));
    }
  }

  deleteAnnouncementEvent = (id) => {
    this.setState({
      idDeleteAnnouncement: id,
      showDeleteAnnouncement: true,
    });
  }

  editAnnouncementEvent = (data) => {
    this.setState({
      idEditAnnouncement: data._id,
      showEditAnnouncement: true,
    });
    this.props.initializeState(
      'editAnnouncementForm',
      {
        message: data.message,
        description: data.description,
        apartments: data.apartments,
        privacy: data.privacy,
        date: data.date,
      },
    );
  }

  handlePageSelect = (pageNum) => {
    this.setState(prevState => ({
      ...prevState,
      currentPage: pageNum,
    }), () => {
      this.handleFilter();
    });
  }

  handleFilter = () => {
    const { currentPage: page } = this.state;
    const skip = (page - 1) * limit;
    const { buildingId } = this.props;
    this.props.loadMoreRows({ buildingId, limit, skip });
  }

  render() {
    const {
      loading,
      currentPage,
      showDeleteAnnouncement,
      showEditAnnouncement,
      idEditAnnouncement,
    } = this.state;
    const {
      buildingId,
      user,
      building,
    } = this.props;
    let announcements = null;
    const pagination = {
      totalPage: 1,
      currentPage,
    };

    if (building) {
      announcements = building.announcements;
      const countRecord = (announcements.pageInfo && announcements.pageInfo.total) || 1;
      if (countRecord <= limit) {
        pagination.totalPage = 1;
      } else {
        pagination.totalPage = Math.ceil(countRecord / limit);
      }
    }

    return (
      <Grid>
        <Loading show={loading} full>Đang tải ...</Loading>
        <Row className={s.containerTop30}>
          <MediaQuery minDeviceWidth={992} values={{ deviceWidth: 1600 }}>
            <Col md={3} smHidden xsHidden>
              <Menu
                user={user}
                parentPath={`/management/${buildingId}`}
                pageKey="announcements_management>announcements"
              />
            </Col>
          </MediaQuery>
          <Col md={9} sm={12} xs={12}>
            <div className={s.container}>
              <Col md={12} className={s.contentMain}>
                <div className={s.header}>
                  <i className="fa fa-bullhorn" aria-hidden="true"></i>
                  <span className={s.headerTitle}>Thông báo</span>
                </div>
                <ul className={s.announcementList}>
                  {
                    !loading && announcements && announcements.edges.map(a => (
                      <BuildingAnnouncementItem
                        key={a._id}
                        data={a}
                        privacy="protected"
                        message={a.message}
                        displayAction
                        onDelete={this.deleteAnnouncementEvent}
                        onEdit={this.editAnnouncementEvent}
                      />
                    ))
                  }
                </ul>
                <div className="pull-right">
                  <Pagination
                    maxButtons={3}
                    prev={pagination.totalPage > 5}
                    next={pagination.totalPage > 5}
                    first={pagination.totalPage > 5}
                    last={pagination.totalPage > 5}
                    ellipsis={pagination.totalPage > 5}
                    items={pagination.totalPage}
                    activePage={pagination.currentPage}
                    onSelect={this.handlePageSelect}
                  />
                </div>
              </Col>
            </div>
          </Col>
        </Row>
        <DeleteAnnouncementModal
          show={showDeleteAnnouncement}
          closeModal={this.closeModal}
          clickModal={this.onClickDeleteModal}
        />
        {idEditAnnouncement &&
          <EditAnnouncementModal
            show={showEditAnnouncement}
            closeModal={this.closeModal}
            clickModal={this.onClickEditModal}
            buildingId={buildingId}
          />
        }
      </Grid>
    );
  }
}

AnnouncementsManagement.propTypes = {
  building: PropTypes.object,
  loadMoreRows: PropTypes.func,
  user: PropTypes.object.isRequired,
  buildingId: PropTypes.string.isRequired,
  deleteAnnouncement: PropTypes.func.isRequired,
  editAnnouncement: PropTypes.func.isRequired,
  initializeState: PropTypes.func.isRequired,
};

export default compose(
  connect(state => ({
    user: state.user,
  }), {
    initializeState,
  }),
  withStyles(s),
  graphql(announcementsQuery, {
    options: ownProps => ({
      variables: {
        buildingId: ownProps.buildingId,
        limit,
        skip: 0,
      },
      fetchPolicy: 'network-only',
    }),
    props: ({ data }) => {
      const {
        fetchMore,
        building,
      } = data;

      const loadMoreRows = (variables) => {
        fetchMore({
          variables,
          fetchPolicy: 'network-only',
          updateQuery: (_, { fetchMoreResult }) => fetchMoreResult,
        });
      };
      return {
        building,
        loadMoreRows,
      };
    },
  }),
  graphql(deleteAnnouncementMutation, {
    props: ({ ownProps, mutate }) => ({
      deleteAnnouncement: idDeleteAnnouncement => mutate({
        variables: {
          _id: idDeleteAnnouncement,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          deleteAnnouncement: {
            __typename: 'Announcement',
            _id: idDeleteAnnouncement,
          },
        },
        update: (store, { data: { deleteAnnouncement } }) => {
          // Read the data from our cache for this query.
          let data = store.readQuery({
            query: announcementsQuery,
            variables: {
              buildingId: ownProps.buildingId,
              skip: 0,
              limit: 4,
            },
          });
          data = update(data, {
            building: {
              announcements: {
                edges: {
                  $unset: [deleteAnnouncement._id],
                },
              },
            },
          });
          // Write our data back to the cache.
          store.writeQuery({
            query: announcementsQuery,
            variables: {
              buildingId: ownProps.buildingId,
              skip: 0,
              limit: 4,
            },
            data,
          });
        },
      }),
    }),
  }),
  graphql(editAnnouncementMutation, {
    props: ({ mutate }) => ({
      editAnnouncement: (idEditAnnouncement, message, description, privacy, apartments) => mutate({
        variables: {
          input: {
            _id: idEditAnnouncement,
            message,
            description,
            privacy,
            apartments,
          },
        },
      }),
    }),
  }),
)(AnnouncementsManagement);
