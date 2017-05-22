import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './FriendStyle.scss';

const Label = ({ label, isBold }) => (
  <h4>{label}</h4>
);

Label.propTypes = {
  label: PropTypes.string.isRequired,
  isBold: PropTypes.bool,
};

export default withStyles(s)(Label);
