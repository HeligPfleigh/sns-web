import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Col, Clearfix } from 'react-bootstrap';
import { convertFromRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import s from './PostText.scss';

const PostText = ({ children, html, className }) => (
  <div className={className}>
    <Clearfix />
    { html && <Col
      className={s.postContent}
      dangerouslySetInnerHTML={{ __html: stateToHTML(convertFromRaw(JSON.parse(html))) }}
    />
    }
    {children}
  </div>
);

PostText.propTypes = {
  children: PropTypes.node,
  html: PropTypes.string,
  className: PropTypes.string,
};

export default withStyles(s)(PostText);
