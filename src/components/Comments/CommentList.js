import React, { Component } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Clearfix } from 'react-bootstrap';

import s from './CommentStyle.scss';
import CommentItem from './CommentItem';

class CommentList extends Component {

  hasMore = () => {
    const { totalComments, comments } = this.props;
    return comments && totalComments > comments.length;
  }

  loadMoreComments = (evt) => {
    evt.preventDefault();
    const comments = this.props.comments ? this.props.comments : [];
    let commentId = null;
    if (comments.length !== 0) {
      commentId = comments[0]._id;
    }
    this.props.loadMoreComments(commentId, this.props.postId);
  }

  render() {
    const { postId, comments, createNewComment } = this.props;

    return (
      <div className={s.commentContent}>
        {this.hasMore() && <a title="Xem thêm" onClick={this.loadMoreComments}>
          <i className="fa fa-hand-o-right" aria-hidden="true"></i> Xem thêm
        </a>}
        {
          comments && comments.map(item => (
            <CommentItem key={item._id} postId={postId} comment={item} createNewComment={createNewComment} />
          ))
        }
        <Clearfix />
      </div>
    );
  }
}

CommentList.propTypes = {
  comments: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
  })).isRequired,
  postId: PropTypes.string.isRequired,
  createNewComment: PropTypes.func.isRequired,
  loadMoreComments: PropTypes.func.isRequired,
  totalComments: PropTypes.number.isRequired,
};

CommentList.defaultProps = {
  comments: [],
  isFocus: false,
};

const userFragment = gql`
  fragment UserView on Author {
    _id,
    username,
    profile {
      picture,
      firstName,
      lastName
    }
  }
`;

const commentFragment = gql`fragment _CommentView on Comment {
    _id,
    message,
    user {
      ...UserView
    },
    parent,
    updatedAt,
  }
  ${userFragment}
`;

CommentList.fragments = {
  loadCommentsQuery: gql`
    query loadCommentsQuery ($postId: String!, $commentId: String, $limit: Int) {
      post (_id: $postId) {
        _id
        comments (_id: $commentId, limit: $limit) {
          _id
          message
          user {
            ...UserView,
          },
          parent,
          reply {
            ..._CommentView
          },
          updatedAt,
        }
      }
    }
    ${userFragment}
    ${commentFragment}`,
};

CommentList.mutation = {
  createNewCommentQuery: gql`
    mutation createNewComment (
      $postId: String!,
      $message: String!,
      $commentId: String,
    ) {
      createNewComment(
        _id: $postId,
        message: $message,
        commentId: $commentId,
      ) {
        ..._CommentView
        reply {
          ..._CommentView
        },
      }
    }
    ${commentFragment}`,
};

export default withStyles(s)(CommentList);
