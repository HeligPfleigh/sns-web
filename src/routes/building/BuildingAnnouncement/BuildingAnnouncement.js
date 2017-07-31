import React, { PropTypes, Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import s from './BuildingAnnouncement.scss';

export class BuildingAnnouncement extends Component {

  render() {
    return (
      <h1>Danh sách các thông báo</h1>
    );
  }
}

BuildingAnnouncement.propTypes = {
};

export default withStyles(s)(BuildingAnnouncement);
