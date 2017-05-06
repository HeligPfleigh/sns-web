import React, { PropTypes } from 'react';
import { convertFromRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import TimeAgo from 'react-timeago';
import vnStrings from 'react-timeago/lib/language-strings/vi';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import {
  Image,
  Col,
} from 'react-bootstrap';
import s from './CommentContent.scss';

const formatter = buildFormatter(vnStrings);

const CommentContent = ({ comment }) => (
  <div className={s.commentPanel}>
    <Col className={s.commentAvarta}>
      <a href="#link-to-profile">
        <Image src={comment.user.profile.picture} circle />
      </a>
    </Col>
    <Col className={s.commentContent}>
      <Col
        dangerouslySetInnerHTML={{
          __html: `<p><a href='#link-to-profile'>${comment.user.profile.firstName}
          ${comment.user.profile.lastName}</a></p>
          ${stateToHTML(convertFromRaw(JSON.parse(comment.message)))}`,
        }}
      />
      <Col className={s.commentControl}>
        <a href="#show-comment-form-handle">Trả lời</a> - <a href="#">
          <TimeAgo date={comment.updatedAt} formatter={formatter} />
        </a>
      </Col>
    </Col>
  </div>
);

CommentContent.propTypes = {
  comment: PropTypes.shape({
    _id: PropTypes.string,
    message: PropTypes.string,
    user: PropTypes.shape({
      _id: PropTypes.string,
      profile: PropTypes.shape({
        picture: PropTypes.string,
        firstName: PropTypes.string,
        lastName: PropTypes.string,
      }),
    }),
    updatedAt: PropTypes.string,
  }),
};

export default withStyles(s)(CommentContent);
