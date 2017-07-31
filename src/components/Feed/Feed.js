import React, { PropTypes, Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {
  Image,
  MenuItem,
  Dropdown,
} from 'react-bootstrap';
import gql from 'graphql-tag';
import { generate as idRandom } from 'shortid';
import includes from 'lodash/includes';
import Post, { PostHeader, PostText, PostActions, PostContent } from '../Card';
import Icon from '../Icon';
import TimeAgo from '../TimeAgo';
import Divider from '../Divider';
import Link from '../Link';
import EditPost from './EditPost';
import SharingPost from './SharingPost';
import CommentList from '../Comments/CommentList';
import { PUBLIC, FRIEND, ONLY_ME, DELETE_POST_ACTION, EDIT_POST_ACTION } from '../../constants';
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
  constructor(props) {
    super(props);
    this.state = {
      isEdit: false,
    };
  }

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
    } = this.props;
    if (eventKey === EDIT_POST_ACTION) {
      this.setState({
        isEdit: true,
      });
    } else {
      onSelectRightEvent(eventKey, _id);
    }
  }

  onSelectShareButton = (eventKey, event) => {
    event.preventDefault();
    const {
      data: {
        _id,
      },
      sharingPostEvent = doNothing,
    } = this.props;
    if (eventKey && includes([PUBLIC, FRIEND, ONLY_ME], eventKey)) {
      sharingPostEvent(_id, eventKey);
    }
  }

  editPostHandler = (value) => {
    const {
      data: {
        _id,
      },
      editPostEvent,
    } = this.props;
    editPostEvent(_id, value);
  }

  closeEditPost = () => {
    this.setState({
      isEdit: false,
    });
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
    } = this.props;
    const { isEdit } = this.state;
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
                  {!sharing && <MenuItem divider /> }
                  {!sharing && <MenuItem eventKey={EDIT_POST_ACTION}>Chỉnh sửa bài viết</MenuItem>}
                </Dropdown.Menu>
              </Dropdown> : <div></div>
          }
        />
        {sharing && !isEdit &&
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
        {!sharing && !isEdit && <PostText html={message || {}} /> }
        {isEdit &&
          <EditPost
            message={message}
            onChange={this.editPostHandler}
            closeEditPost={this.closeEditPost}
          />
        }
        <PostText className={s.postStatistic}>
          <a href="#" onClick={doNothing}>{ totalLikes } Thích</a>
          <a href="#" onClick={doNothing}>{ totalComments } Bình luận</a>
        </PostText>
        <Divider />
        <PostActions>
          <Icon
            onClick={this.onLikeCLick}
            title="Thích"
            icons={`${isLiked ? s.likeColor : 'fa-heart-o'} fa fa-heart fa-lg`}
          />
          <Icon onClick={doNothing} title="Bình luận" icons="fa fa-comment-o fa-lg" />
          <Dropdown id={idRandom()}>
            <CustomToggle bsRole="toggle">
              <span title="Chia sẻ">
                <i className="fa fa-share fa-lg" aria-hidden="true"></i> Chia sẻ
              </span>
            </CustomToggle>
            <Dropdown.Menu onSelect={this.onSelectShareButton}>
              <MenuItem eventKey={PUBLIC}>Chi sẻ công khai</MenuItem>
              <MenuItem eventKey={FRIEND}>Chia sẻ với bạn bè</MenuItem>
              <MenuItem eventKey={ONLY_ME}>Chỉ mình tôi</MenuItem>
            </Dropdown.Menu>
          </Dropdown>
        </PostActions>
        <PostContent className={s.commentPanel}>
          <CommentList comments={comments.slice().reverse() || []} isFocus={false} postId={_id} user={userInfo} totalComments={totalComments} loadMoreComments={loadMoreComments} createNewComment={createNewComment} />
        </PostContent>
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
  editPost: gql`mutation editPost ($postId: String!, $message: String!) {
    editPost(_id: $postId, message: $message) {
      _id
      message
    }
  }`,
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
  sharingPost: gql`mutation sharingPost ($_id: String!, $privacy: String!) {
    sharingPost(_id: $_id, privacy: $privacy) {
      ...PostView
    }
  }
  ${Feed.fragments.post}
  `,
};

export default withStyles(s)(Feed);
