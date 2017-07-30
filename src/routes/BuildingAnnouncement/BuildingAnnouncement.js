import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import buildingAnnouncementQuery from './buildingAnnouncementQuery.graphql';
import BuildingAnnouncementList, {
  BuildingAnnouncementHeader,
  BuildingAnnouncementItem,
} from './BuildingAnnouncement';
import s from './BuildingAnnouncement.scss';

class BuildingAnnouncement extends Component {
  render() {
    const { data: { loading, resident: { building } } } = this.props;
    return (
      <div>
        {loading && <h1 style={{ textAlign: 'center' }}>Đang tải dữ liệu</h1>}
        <BuildingAnnouncementList>
          <BuildingAnnouncementHeader />
          {
            !loading && building && building.announcements && building.announcements.edges.map(a =>
              <BuildingAnnouncementItem
                key={a._id}
                data={a}
              />,
            )
          }
        </BuildingAnnouncementList>
      </div>
    );
  }
}

BuildingAnnouncement.propTypes = {
  data: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
  }).isRequired,
};

export default compose(
  withStyles(s),
  connect(state => ({
    user: state.user,
  })),
  graphql(buildingAnnouncementQuery, {
    options: ownProps => ({
      variables: {
        userId: ownProps.user.id,
        cursor: null,
        limit: 3,
      },
      fetchPolicy: 'network-only',
    }),
  }),
)(BuildingAnnouncement);
