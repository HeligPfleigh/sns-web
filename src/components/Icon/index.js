import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Icon.scss';

function defaultClick(e) {
  e.preventDefault();
}

const Icon = ({ onClick = defaultClick, title, icons }) => (
  <a href="#" onClick={onClick}>
    <i className={icons} aria-hidden="true"></i>&nbsp;
    <span>{title}</span>
  </a>
);

Icon.propTypes = {
  onClick: PropTypes.func,
  title: PropTypes.node,
  icons: PropTypes.string.isRequired,
};

export default withStyles(s)(Icon);
