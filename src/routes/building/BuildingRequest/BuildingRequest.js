import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import FriendList, { Friend } from '../FriendList';
import Errors from '../Errors';
import s from './BuildingRequest.scss';

export const BuildingRequest = ({ building, error, accept, cancel }) => (
  <FriendList>
    <Errors
      open
      message={error}
      autoHideDuration={4000}
    />
    {
      building && building.requests.length === 0 && <h3>
        Bạn không có bất kì yêu cầu nào
      </h3>
    }
    {
      building && building.requests.length > 0 && building.requests.map(friend =>
        <Friend key={friend._id} friend={friend} onAccept={accept(friend)} onCancel={cancel(friend)} />,
      )
    }
  </FriendList>
);

BuildingRequest.propTypes = {
  building: PropTypes.object,
  error: PropTypes.string,
  accept: PropTypes.func,
  cancel: PropTypes.func,
};

export default withStyles(s)(BuildingRequest);
