import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Col, Clearfix } from 'react-bootstrap';
import { convertFromRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import classNames from 'classnames';
import s from './PostText.scss';
import ReadMore from './ReadMore';

const PostText = ({ children, html, className }) => (
  <div className={classNames(s.postContent, className)}>
    <Clearfix />
    <ReadMore className={s.postContent}>
      {
        html && <Col
          dangerouslySetInnerHTML={{ __html: stateToHTML(convertFromRaw(JSON.parse(html))) }}
        />
      }
    </ReadMore>
    {children}
  </div>
);

PostText.propTypes = {
  children: PropTypes.node,
  html: PropTypes.string,
  className: PropTypes.string,
};

export default withStyles(s)(PostText);
