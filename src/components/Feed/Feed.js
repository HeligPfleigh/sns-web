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
import { PUBLIC, FRIEND, ONLY_ME } from '../../constants';

import s from './Feed.scss';

function doNothing(e) {
  e.preventDefault();
}

export const Feed = ({
  data: {
    _id,
    message,
    user,
    author,
    totalLikes,
    isLiked,
    totalComments = 0,
    createdAt,
    comments = [],
    privacy,
    building,
  },
  likePostEvent = doNothing,
  unlikePostEvent,
  userInfo,
  loadMoreComments,
  createNewComment,
}) => (
  <Post>
    <PostHeader
      avatar={
        <span>
          { author &&
            <Link title={`${author.profile.firstName} ${author.profile.lastName}`} to={`/user/${author._id}`}>
              <Image src={author.profile.picture} circle />
            </Link>
          }
        </span>
      }
      title={
        <span>
          { author && <Link to={`/user/${author._id}`}>
            <strong>{`${author.profile.firstName} ${author.profile.lastName}`}</strong>
            </Link>
          }

          { ((user && (user._id !== author._id)) || building) &&
            <span style={{ margin: '0 6px' }}>
              <i className="fa fa-caret-right" aria-hidden="true"></i>
            </span>
          }

          { !building && user && (user._id !== author._id) && <Link to={`/user/${user._id}`}>
            <strong>{`${user.profile.firstName} ${user.profile.lastName}`}</strong>
          </Link>
          }
          { building && <Link to={`/building/${building._id}`}>
            <strong>{building.name}</strong>
          </Link>
          }
        </span>
      }
      subtitle={<div>
        { PUBLIC === privacy && <Icon onClick={doNothing} icons="fa fa-globe fa-1" /> }
        { FRIEND === privacy && <Icon onClick={doNothing} icons="fa fa-users fa-1" /> }
        { ONLY_ME === privacy && <Icon onClick={doNothing} icons="fa fa-user fa-1" /> }
        <Link to={`/post/${_id}`}><TimeAgo time={createdAt} /></Link>
      </div>}
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
    building: PropTypes.shape({
      _id: PropTypes.string,
      name: PropTypes.string,
    }),
    privacy: PropTypes.string,
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
    message
    user {
      _id
      username
      profile {
        picture
        firstName
        lastName
      }
    },
    parent
    updatedAt
  }
`;

Feed.fragments = {
  comment: commentFragment,
  // user: userFragment,
  post: gql`
    fragment PostView on Post {
      _id,
      message
      user {
        _id
        username
        profile {
          picture
          firstName
          lastName
        }
      }
      author {
        _id
        username
        profile {
          picture
          firstName
          lastName
        }
      }
      building {
        _id
        name
      }
      totalLikes
      totalComments
      isLiked
      createdAt
      privacy
      comments (limit: 2) {
        _id
        message
        user {
          _id
          username
          profile {
            picture
            firstName
            lastName
          }
        },
        parent
        reply {
          ...CommentView
        },
        updatedAt
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
