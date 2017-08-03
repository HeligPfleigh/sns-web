import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Panel } from 'react-bootstrap';
import BuildingAnnouncementList, {
  BuildingAnnouncementItem,
} from '../../../components/BuildingAnnouncementList';

import NewAnnouncement from '../NewAnnouncement';
import s from './BuildingAnnouncementTab.scss';

export const BuildingRequest = ({ building, loadBuildingQuery, deleteAnnouncement, editAnnouncement }) => (
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
    <BuildingAnnouncementList>
      {
        building && building.announcements && building.announcements.edges.map(a =>
          <BuildingAnnouncementItem
            key={a._id}
            data={a}
            onDelete={deleteAnnouncement}
            onEdit={editAnnouncement}
            displayAction
          />,
        )
      }
    </BuildingAnnouncementList>
  </div>
);

BuildingRequest.propTypes = {
  building: PropTypes.object,
  loadBuildingQuery: PropTypes.object,
  deleteAnnouncement: PropTypes.func,
  editAnnouncement: PropTypes.func,
};

export default withStyles(s)(BuildingRequest);
