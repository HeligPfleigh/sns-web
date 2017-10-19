import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Element } from 'react-scroll';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import NewComment from '../NewComment';
import CommentItem from './Node/CommentItem';
import s from './styles.scss';

class CommentItemWrapper extends Component {

  constructor(props) {
    super(props);
    this.state = {
      flag: true,
      commentId: null,
    };
  }

  showCommentForm = ({ _id, parent, user }) => {
    const content = `@${user.username} - `;
    this.setState({
      flag: !this.state.flag,
      commentId: parent || _id,
      initContent: parent ? content : '',
    });
  }

  render() {
    const { postId, comment, createNewComment } = this.props;
    const { initContent, commentId, flag } = this.state;

    const cssShow = {
      display: commentId === comment._id ? 'block' : 'none',
    };

    const offset = commentId && commentId === comment._id ? -100 : 50;

    return (
      <span>
        <CommentItem offset={offset} comment={comment} showCommentForm={this.showCommentForm} />
        {comment && comment.reply && comment.reply.map(_item => (
          <span className={s.subComment} key={_item._id}>
            <CommentItem offset={offset} comment={_item} showCommentForm={this.showCommentForm} />
          </span>
        ))}
        <Element name={`#add-comment-${comment._id}`} className={s.subComment} style={cssShow}>
          <NewComment
            flag={flag}
            postId={postId}
            commentId={commentId}
            initContent={initContent}
            createNewComment={createNewComment}
            isFocus={(commentId && commentId === comment._id) || false}
          />
        </Element>
      </span>
    );
  }
}

CommentItemWrapper.propTypes = {
  postId: PropTypes.string.isRequired,
  comment: PropTypes.object.isRequired,
  createNewComment: PropTypes.func.isRequired,
};

export default withStyles(s)(CommentItemWrapper);
