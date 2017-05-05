import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './CommentItem.scss';
import CommentContent from './CommentContent';

const CommentItem = ({ comment }) => (
  <div>
    <CommentContent comment={comment} showCommentForm={this.showCommentForm} />
    {comment && comment.reply && comment.reply.map(_item => (
      <span className={s.subComment} key={_item._id}>
        <CommentContent comment={_item} showCommentForm={this.showCommentForm} />
      </span>
    ))}
  </div>
);

CommentItem.propTypes = {
  comment: PropTypes.object.isRequired,
};

export default withStyles(s)(CommentItem);
