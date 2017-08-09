import React, { PropTypes, Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {
  Image,
  MenuItem,
  Dropdown,
} from 'react-bootstrap';
import gql from 'graphql-tag';
import { generate as idRandom } from 'shortid';
import { noop } from 'lodash';
import Post, { PostHeader, PostText, PostActions, PostContent, PostPhotos } from '../Card';
import Icon from '../Icon';
import TimeAgo from '../TimeAgo';
import Divider from '../Divider';
import Link from '../Link';
import SharingPost from './SharingPost';
import CommentList from '../Comments/CommentList';
import {
  PUBLIC,
  FRIEND,
  ONLY_ME,
  DELETE_POST_ACTION,
  EDIT_POST_ACTION,
  ONLY_ADMIN_BUILDING,
} from '../../constants';
import s from './Feed.scss';

function doNothing(e) {
  e.preventDefault();
}

const CustomToggle = ({ onClick, children }) => (
  <a onClick={onClick}>
    { children }
  </a>
);

CustomToggle.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node,
};

class Feed extends Component {

  onLikeCLick = (evt) => {
    evt.preventDefault();
    const {
      data: {
        _id,
        message,
        user,
        totalLikes,
        isLiked,
        totalComments = 0,
      },
      likePostEvent = doNothing,
      unlikePostEvent = doNothing,
    } = this.props;
    if (!isLiked) {
      likePostEvent(_id, message, totalLikes, totalComments, user);
    } else {
      unlikePostEvent(_id, message, totalLikes, totalComments, user);
    }
  }

  onSelectRightEvent = (eventKey, event) => {
    event.preventDefault();
    const {
      data: {
        _id,
      },
      onSelectRightEvent = doNothing,
      editPostEvent = doNothing,

    } = this.props;
    if (eventKey === EDIT_POST_ACTION) {
      editPostEvent(_id, this.props.data);
    } else {
      onSelectRightEvent(eventKey, _id);
    }
  }

  onSelectShareButton = (event) => {
    event.preventDefault();
    const {
      data: {
        _id,
        sharing,
      },
      sharingPostEvent = doNothing,
    } = this.props;
    sharingPostEvent(_id, sharing || this.props.data);
  }

  render() {
    const {
      data: {
        _id,
        message,
        user,
        author,
        totalLikes,
        isLiked,
        photos,
        totalComments = 0,
        createdAt,
        comments = [],
        privacy,
        building,
        sharing,
      },
      userInfo,
      loadMoreComments,
      createNewComment,
      sharingPostModalOpenned,
    } = this.props;
    return (
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
          sharingPostTitle={
            <span>
              {sharing && author._id !== sharing.author._id &&
                <Link to={`/user/${sharing.author._id}`}>
                đã chia sẻ bài viết của <strong>{`${sharing.author.profile.firstName} ${sharing.author.profile.lastName}`}</strong>
                </Link>
              }
              { sharing && author._id === sharing.author._id &&
                <span>đã chia sẻ bài viết của mình</span>
              }
            </span>
          }
          subtitle={<div>
            { PUBLIC === privacy && <Icon onClick={doNothing} icons="fa fa-globe fa-1" /> }
            { FRIEND === privacy && <Icon onClick={doNothing} icons="fa fa-users fa-1" /> }
            { ONLY_ME === privacy && <Icon onClick={doNothing} icons="fa fa-user fa-1" /> }
            { ONLY_ADMIN_BUILDING === privacy && <Icon onClick={doNothing} icons="fa fa-bell fa-1" /> }
            <Link to={`/post/${_id}`}><TimeAgo time={createdAt} /></Link>
          </div>}
          menuRight={
            (author && userInfo && author._id === userInfo._id) ?
              <Dropdown id={idRandom()} pullRight>
                <CustomToggle bsRole="toggle">
                  <span title="Tùy chọn">
                    <i className="fa fa-circle-o" aria-hidden="true"></i>
                    <i className="fa fa-circle-o" aria-hidden="true"></i>
                    <i className="fa fa-circle-o" aria-hidden="true"></i>
                  </span>
                </CustomToggle>
                <Dropdown.Menu onSelect={this.onSelectRightEvent}>
                  <MenuItem eventKey={DELETE_POST_ACTION}>Xóa</MenuItem>
                  <MenuItem divider />
                  <MenuItem eventKey={EDIT_POST_ACTION}>Chỉnh sửa bài viết</MenuItem>
                </Dropdown.Menu>
              </Dropdown> : <div></div>
          }
        />
        {message && <PostText html={message} /> }
        {!message && <div style={{ padding: '22px' }} /> }
        {sharing &&
          <SharingPost
            id={sharing._id}
            message={sharing.message}
            author={sharing.author}
            user={sharing.user}
            building={sharing.building}
            privacy={sharing.privacy}
            createdAt={sharing.createdAt}
          />
        }
        {!sharing && photos && photos.length > 0 && <PostPhotos images={photos} />}
        <PostText className={s.postStatistic}>
          <a href="#" onClick={doNothing}>{ totalLikes } Thích</a>
          <a href="#" onClick={doNothing}>{ totalComments } Bình luận</a>
        </PostText>
        { !sharingPostModalOpenned && (
        <Divider />
        ) }
        { !sharingPostModalOpenned && (
        <PostActions>
          <Icon
            onClick={this.onLikeCLick}
            title="Thích"
            icons={`${isLiked ? s.likeColor : 'fa-heart-o'} fa fa-heart fa-lg`}
          />
          <Icon onClick={doNothing} title="Bình luận" icons="fa fa-comment-o fa-lg" />
          <Icon onClick={this.onSelectShareButton} title="Chia sẻ" icons="fa fa-share fa-lg" />
        </PostActions>
        ) }
        { !sharingPostModalOpenned && (
        <PostContent className={s.commentPanel}>
          <CommentList comments={comments.slice().reverse() || []} isFocus={false} postId={_id} user={userInfo} totalComments={totalComments} loadMoreComments={loadMoreComments} createNewComment={createNewComment} />
        </PostContent>
        ) }
      </Post>
    );
  }
}

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
    sharing: PropTypes.shape({
      _id: PropTypes.string,
      message: PropTypes.string,
      author: PropTypes.shape({
        _id: PropTypes.string,
        profile: PropTypes.shape({
          picture: PropTypes.string,
          firstName: PropTypes.string,
          lastName: PropTypes.string,
        }),
      }),
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
      createdAt: PropTypes.string,
    }),
    privacy: PropTypes.string,
    totalLikes: PropTypes.number,
    totalComments: PropTypes.number,
    createdAt: PropTypes.string,
    comments: PropTypes.array,
  }),
  likePostEvent: PropTypes.func.isRequired,
  unlikePostEvent: PropTypes.func.isRequired,
  onSelectRightEvent: PropTypes.func.isRequired,
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
  editPostEvent: PropTypes.func.isRequired,
  sharingPostEvent: PropTypes.func.isRequired,
  sharingPostModalOpenned: PropTypes.bool,
};

Feed.defaultProps = {
  data: {
    comments: [],
    totalComments: 0,
  },
  userInfo: {},
  sharingPostModalOpenned: false,
  onSelectRightEvent: noop,
  editPostEvent: noop,
  likePostEvent: noop,
  unlikePostEvent: noop,
  loadMoreComments: noop,
  createNewComment: noop,
  sharingPostEvent: noop,
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
  requests: gql`
    fragment UsersAwaitingApproval on Friend {
      _id
      username
      phone {
        number
        verified
      }
      emails {
        address
        verified
      }
      profile {
        picture
        firstName
        lastName
        gender
      }
      apartments {
        _id
        number
        isOwner
        building {
          _id
          name
          isAdmin
        }
      }
      building {
        _id
        name
        isAdmin
      }
    }
  `,
  // user: userFragment,
  post: gql`
    fragment PostView on Post {
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
      }
      sharing {
        _id
        message
        author {
          _id
          username
          profile {
            picture
            firstName
            lastName
          }
        }
        user {
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
        privacy
        createdAt
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
      photos
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
  editPost: gql`mutation editPost ($postId: String!, $message: String!, $photos: [String], $isDelPostSharing: Boolean!) {
    editPost(_id: $postId, message: $message, photos: $photos, isDelPostSharing: $isDelPostSharing) {
      ...PostView
    }
  }
  ${Feed.fragments.post}`,
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
  deletePost: gql`mutation deletePost ($_id: String!) {
    deletePost(_id: $_id) {
      _id
    }
  }
  `,
  sharingPost: gql`mutation sharingPost ($_id: String!, $privacy: String!, $message: String!) {
    sharingPost(_id: $_id, privacy: $privacy, message: $message) {
      ...PostView
    }
  }
  ${Feed.fragments.post}
  `,
};

export default withStyles(s)(Feed);
