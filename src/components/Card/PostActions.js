import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Col } from 'react-bootstrap';
import s from './PostActions.scss';

export const PostActions = ({ children }) => (
  <Col className={s.postControl}>{children}</Col>
);

PostActions.propTypes = {
  children: PropTypes.node,
};

export default withStyles(s)(PostActions);
