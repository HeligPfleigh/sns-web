import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import FriendList, { Friend } from '../FriendList';
import Errors from '../Errors';
import s from './BuildingRequestTab.scss';

export const BuildingRequestTab = ({ data, error, onAccept, onCancel }) => (
  <FriendList>
    <Errors
      open
      message={error}
      autoHideDuration={4000}
    />
    {!data.edges && <h3>Bạn không có bất kì yêu cầu nào</h3>}
    {data.edges.map(user => <Friend key={Math.random()} friend={user} onAccept={onAccept(user)} onCancel={onCancel(user)} />)}
  </FriendList>
);

BuildingRequestTab.defaultProps = {
  data: {
    edges: []
  }
}

BuildingRequestTab.propTypes = {
  data: PropTypes.shape({
    edges: PropTypes.arrayOf(PropTypes.object)
  }).isRequired,
  error: PropTypes.string,
  onAccept: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default withStyles(s)(BuildingRequestTab);
