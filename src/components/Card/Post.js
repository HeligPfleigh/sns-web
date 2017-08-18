import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Post.scss';

export const Post = ({ children }) => (
  <div className={s.PostPanel}>{children}</div>
);

Post.propTypes = {
  children: PropTypes.node,
};

export default withStyles(s)(Post);
