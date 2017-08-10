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

function stripTags(input) {
  if (!_.isString(input)) {
    return false;
  }
  const tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi; // Match any html tag
  const commentsTags = /<!--[\s\S]*?-->/gi; // Match <!--, -->
  const whiteSpace = /\s+/gi; // Match any whitespace

  return input.replace(tags, '').replace(commentsTags, '').replace(whiteSpace, ''); // Just replace it by an empty string
}

class PostText extends React.Component {

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
