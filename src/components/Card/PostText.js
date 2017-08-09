import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Col, Clearfix } from 'react-bootstrap';
import { convertFromRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import classNames from 'classnames';
import * as _ from 'lodash';

import s from './PostText.scss';
import ReadMore from './ReadMore';
import VideoView from '../VideoView';
import {
  checkYoutubeUrl,
} from '../../utils/regexUrl';

function strip_tags(input) {
  if (!_.isString(input)) {
    return false;
  }
  let tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, // Match any html tag
    commentsTags = /<!--[\s\S]*?-->/gi, // Match <!--, -->
    whiteSpace = /\s+/gi; // Match any whitespace

  return input.replace(commentsTags, '').replace(tags, '').replace(whiteSpace, ''); // Just replace it by an empty string
}

class PostText extends React.Component {

  render() {
    const { children, html, className } = this.props;
    if (!html) {
      return <div />;
    }
    const __html = stateToHTML(convertFromRaw(JSON.parse(html)));
    if (!strip_tags(__html)) {
      return <div />;
    }

    const data = JSON.parse(html);
    let isShow = false;
    let idVideo = '';
    if (data.blocks) {
      isShow = false;
      data.blocks.forEach((block) => {
        if (checkYoutubeUrl(block.text)) {
          isShow = true;
          idVideo = block.text.split('v=')[1];
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
        <VideoView
          isShow={isShow}
          src={idVideo}
        />
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
