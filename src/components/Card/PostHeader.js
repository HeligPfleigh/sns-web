import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Image, Col } from 'react-bootstrap';
import s from './PostHeader.scss';

const PostHeader = ({ title, subtitle }) => (
  <div>
    <Col className={s.postHeaderLeft}>
      <div className={s.avarta}>
        <a href="#">
          <Image src="https://graph.facebook.com/596825810516199/picture?type=large" circle />
        </a>
      </div>
      <div className={s.userInfo}>
        { title }
        <br />
        { subtitle }
        <br />
      </div>
    </Col>
    <Col className={s.postHeaderRight}>
      <span>
        <i className="fa fa-circle-o" aria-hidden="true"></i>
        <i className="fa fa-circle-o" aria-hidden="true"></i>
        <i className="fa fa-circle-o" aria-hidden="true"></i>
      </span>
    </Col>
  </div>
);

PostHeader.propTypes = {
  title: PropTypes.node,
  subtitle: PropTypes.node,
};

export default withStyles(s)(PostHeader);
