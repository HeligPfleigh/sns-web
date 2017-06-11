import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Image } from 'react-bootstrap';
import gql from 'graphql-tag';
import Post, { PostHeader, PostText, PostActions, PostContent } from '../Card';
import Icon from '../Icon';
import TimeAgo from '../TimeAgo';
import Divider from '../Divider';
import Link from '../Link';
import CommentList from '../Comments/CommentList';
import s from './Feed.scss';

function doNothing(e) {
  e.preventDefault();
}

export const Feed = ({ data: { _id, message, user, author, totalLikes, isLiked, totalComments = 0, createdAt, comments = [] }, likePostEvent = doNothing, unlikePostEvent, userInfo, loadMoreComments, createNewComment }) => (
  <Post>
    <PostHeader
      avatar={
        <span>
          { author && (user._id !== author._id) &&
            <Link to={`/user/${author._id}`}>
              <Image src={author.profile.picture} circle />
            </Link>
          }

          { author && (user._id === author._id) &&
            <Link to={`/user/${user._id}`}>
              <Image src={user.profile.picture} circle />
            </Link>
          }
        </span>
      }
      title={
        <span>
          { author && (user._id !== author._id) && <Link to={`/user/${author._id}`}>
            <strong>{`${author.profile.firstName} ${author.profile.lastName}`}</strong>
            </Link>
          }

          { author && (user._id !== author._id) &&
            <span style={{ margin: '0 6px' }}>
              <i className="fa fa-caret-right" aria-hidden="true"></i>
            </span>
          }
          <Link to={`/user/${user._id}`}>
            <strong>{`${user.profile.firstName} ${user.profile.lastName}`}</strong>
          </Link>
        </span>
      }
      subtitle={<Link to={`/post/${_id}`}><TimeAgo time={createdAt} /></Link>}
    />
    <PostText html={message} />
    <PostText className={s.postStatistic}>
      <a href="#" onClick={doNothing}>{ totalLikes } Thích</a>
      <a href="#" onClick={doNothing}>{ totalComments } Bình luận</a>
    </PostText>
    <Divider />
    <PostActions>
      <Icon
        onClick={(e) => {
          e.preventDefault();
          if (!isLiked) {
            likePostEvent(_id, message, totalLikes, totalComments, user);
          } else {
            unlikePostEvent(_id, message, totalLikes, totalComments, user);
          }
        }} title="Thích" icons={`${isLiked ? s.likeColor : 'fa-heart-o'} fa fa-heart fa-lg`}
      />
      <Icon onClick={doNothing} title="Bình luận" icons="fa fa-comment-o fa-lg" />
      <Icon onClick={doNothing} title="Chia sẻ" icons="fa fa-share fa-lg" />
    </PostActions>
    <PostContent className={s.commentPanel}>
      <CommentList comments={comments.slice().reverse() || []} isFocus={false} postId={_id} user={userInfo} totalComments={totalComments} loadMoreComments={loadMoreComments} createNewComment={createNewComment} />
    </PostContent>
  </Post>
);

Feed.propTypes = {
  data: PropTypes.shape({
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
    totalLikes: PropTypes.number,
    totalComments: PropTypes.number,
    createdAt: PropTypes.string,
    comments: PropTypes.array,
  }),
  likePostEvent: PropTypes.func.isRequired,
  unlikePostEvent: PropTypes.func.isRequired,
  loadMoreComments: PropTypes.func.isRequired,
  createNewComment: PropTypes.func.isRequired,
  userInfo: PropTypes.shape({
    _id: PropTypes.string,
    profile: PropTypes.shape({
      picture: PropTypes.string,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
    }),
  }),
};

Feed.defaultProps = {
  data: {
    comments: [],
    totalComments: 0,
  },
};

/**
const userFragment = gql`
  fragment UserView on User {
    _id,
    username,
    profile {
      picture,
      firstName,
      lastName
    }
  }
`;
*/

const commentFragment = gql`fragment CommentView on Comment {
    _id,
    message,
    user {
      _id,
      username,
      profile {
        picture,
        firstName,
        lastName
      }
    },
    parent,
    updatedAt,
  }
`;

Feed.fragments = {
  comment: commentFragment,
  // user: userFragment,
  post: gql`
    fragment PostView on Post {
      _id,
      message,
      user {
        _id,
        username,
        profile {
          picture,
          firstName,
          lastName
        }
      },
      author {
        _id,
        username,
        profile {
          picture,
          firstName,
          lastName
        }
      },
      totalLikes,
      totalComments,
      isLiked,
      createdAt,
      comments (limit: 2) {
        _id
        message
        user {
          _id,
          username,
          profile {
            picture,
            firstName,
            lastName
          }
        },
        parent,
        reply {
          ...CommentView
        },
        updatedAt,
      }
    }
    ${commentFragment}
  `,
};

Feed.mutation = {
  createNewPost: gql`mutation createNewPost ($message: String!, $userId: String) {
    createNewPost(message: $message, userId: $userId) {
      ...PostView
    }
  }
  ${Feed.fragments.post}
  `,
  likePost: gql`mutation likePost ($postId: String!) {
    likePost(_id: $postId) {
      ...PostView
    }
  }
  ${Feed.fragments.post}
  `,
  unlikePost: gql`mutation unlikePost ($postId: String!) {
    unlikePost(_id: $postId) {
      ...PostView
    }
  }
  ${Feed.fragments.post}
  `,
};

export default withStyles(s)(Feed);
