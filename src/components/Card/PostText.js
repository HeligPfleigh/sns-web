import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Col, Clearfix } from 'react-bootstrap';
import { convertFromRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import classNames from 'classnames';
import * as _ from 'lodash';

import s from './PostText.scss';
import ReadMore from './ReadMore';

const PostText = ({ children, html, className }) => {
  if (!html) {
    return <div/>;
  }
  const __html = stateToHTML(convertFromRaw(JSON.parse(html)));
  if (!strip_tags(__html)) {
    return <div/>;
  }
  return (
    <div className={classNames(s.postContent, className)}>
      <Clearfix />
      <ReadMore className={s.postContent}>
        <Col
            dangerouslySetInnerHTML={{ __html, }}
        />
      </ReadMore>
      {children}
    </div>
  ) 
};

function strip_tags (input) {
    if (!_.isString(input)) {
      return false;
    }
    var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, // Match any html tag
        commentsTags = /<!--[\s\S]*?-->/gi, // Match <!--, -->
        whiteSpace = /\s+/gi; // Match any whitespace

    return input.replace(commentsTags, '').replace(tags, '').replace(whiteSpace, ''); // Just replace it by an empty string
}

PostText.propTypes = {
  children: PropTypes.node,
  html: PropTypes.string,
  className: PropTypes.string,
};

export default withStyles(s)(PostText);
