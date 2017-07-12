import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {
  Col,
} from 'react-bootstrap';
import s from './PostHeader.scss';

const PostHeader = ({ avatar, title, subtitle, menuRight }) => (
  <div>
    <Col className={s.postHeaderLeft}>
      <div className={s.avarta}>
        { avatar }
      </div>
      <div className={s.userInfo}>
        { title }
        <br />
        { subtitle }
        <br />
      </div>
    </Col>
    <Col className={s.postHeaderRight}>
      { menuRight }
    </Col>
  </div>
);

PostHeader.propTypes = {
  avatar: PropTypes.node,
  title: PropTypes.node,
  subtitle: PropTypes.node,
  menuRight: PropTypes.node,
};

export default withStyles(s)(PostHeader);
