import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import buildingAnnouncementQuery from './buildingAnnouncementQuery.graphql';
import BuildingAnnouncementList, {
  BuildingAnnouncementHeader,
  BuildingAnnouncementItem,
} from '../../components/BuildingAnnouncementList';
import s from './BuildingAnnouncement.scss';

class BuildingAnnouncement extends Component {
  render() {
    const { data: { loading, resident } } = this.props;
    let building = null;
    if (resident) {
      building = resident.building;
    }
    return (
      <div>
        {loading && <h1 style={{ textAlign: 'center' }}>Đang tải dữ liệu</h1>}
        {!loading && building &&
          <BuildingAnnouncementList buildingId={building._id}>
            <BuildingAnnouncementHeader />
            {
              building.announcements && building.announcements.edges.map((a) => {
                let newMessage = null;
                const oldMessageLength = a.message.length;
                if (oldMessageLength > 21) {
                  newMessage = a.message.slice(0, 20).concat('...');
                  return (
                    <BuildingAnnouncementItem
                      key={a._id}
                      data={a}
                      message={newMessage}
                    />
                  );
                }
                return (
                  <BuildingAnnouncementItem
                    key={a._id}
                    data={a}
                    message={a.message}
                  />
                );
              })
            }
          </BuildingAnnouncementList>
        }
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
        limit: 3,
      },
      fetchPolicy: 'network-only',
    }),
  }),
)(BuildingAnnouncement);
