import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {
  Col,
  Clearfix,
} from 'react-bootstrap';
import s from './PostHeader.scss';

const PostHeader = ({ avatar, title, sharingPostTitle, subtitle, menuRight }) => (
  <div>
    <Col className={s.postHeaderLeft}>
      <div className={s.avarta}>
        { avatar }
      </div>
      <div className={s.userInfo}>
        { title } { sharingPostTitle }
        <br />
        { subtitle }
        <br />
      </div>
    </Col>
    <Col className={s.postHeaderRight}>
      { menuRight }
    </Col>
    <Clearfix />
  </div>
  );

PostHeader.propTypes = {
  avatar: PropTypes.node,
  title: PropTypes.node,
  subtitle: PropTypes.node,
  menuRight: PropTypes.node,
  sharingPostTitle: PropTypes.node,
};

export default withStyles(s)(PostHeader);
