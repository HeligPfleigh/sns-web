import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Post.scss';

const Post = ({ children }) => (
  <div className={s.PostPanel}>{children}</div>
);

Post.propTypes = {
  children: PropTypes.node,
};

export default withStyles(s)(Post);
