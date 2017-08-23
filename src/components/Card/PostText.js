import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Col, Clearfix } from 'react-bootstrap';
import { convertFromRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import classNames from 'classnames';
import * as _ from 'lodash';
import ReactPlayer from 'react-player';

import s from './PostText.scss';
import ReadMore from './ReadMore';
import regexUrl from '../../utils/regexUrl';

function stripTags(input) {
  if (!_.isString(input)) {
    return false;
  }
  const tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi; // Match any html tag
  const commentsTags = /<!--[\s\S]*?-->/gi; // Match <!--, -->
  const whiteSpace = /\s+/gi; // Match any whitespace

  return input.replace(tags, '').replace(commentsTags, '').replace(whiteSpace, ''); // Just replace it by an empty string
}

class PostText extends Component {

  render() {
    const { children, html, className } = this.props;
    if (!html) {
      return <div />;
    }
    let __html = stateToHTML(convertFromRaw(JSON.parse(html)));
    if (!stripTags(__html)) {
      return <div />;
    }
    __html = __html.replace(/<\/p>/gi, '<br/></p>');

    const data = JSON.parse(html);
    const videoUrls = [];
    if (data.blocks) {
      data.blocks.forEach((block) => {
        if (regexUrl(block.text.trim())) {
          videoUrls.push(block.text.trim());
        }
      });
    }

    return (
      <div className={classNames(s.postContent, className)}>
        <Clearfix />
        <ReadMore className={s.postContent}>
          <Col
            dangerouslySetInnerHTML={{ __html }}
          />
        </ReadMore>
        { videoUrls.map(url => <ReactPlayer url={url} key={Math.random()} width="auto" height="360px" />) }
        {children}
      </div>
    );
  }

}


PostText.propTypes = {
  children: PropTypes.node,
  html: PropTypes.string,
  className: PropTypes.string,
};

export default withStyles(s)(PostText);
