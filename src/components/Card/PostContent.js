import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Col } from 'react-bootstrap';
import classNames from 'classnames';
import s from './PostContent.scss';

export const PostContent = ({ children, className }) => (
  <Col className={classNames(s.postContent, className)}>{children}</Col>
);

PostContent.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export default withStyles(s)(PostContent);
