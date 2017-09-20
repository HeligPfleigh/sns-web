import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {
  Image,
  MenuItem,
  Dropdown,
  Button,
  Row,
  Col,
  Clearfix,
} from 'react-bootstrap';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { generate as idRandom } from 'shortid';
import noop from 'lodash/noop';
import classnames from 'classnames';
import moment from 'moment';

import history from '../../core/history';
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
  POST_TYPE_STATUS,
  POST_TYPE_EVENT,
  SHARE,
  SHARE_FRIEND,
} from '../../constants';
import interestEvent from '../EventsComponents/EventList/interestEvent.graphql';
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

  constructor(...args) {
    super(...args);

    this.state = {
      isInterested: false,
    };

    this.onInterested = this.onInterested.bind(this);
    this.onLike = this.onLike.bind(this);
    this.onSelectRightEvent = this.onSelectRightEvent.bind(this);
    this.onSelectShareButton = this.onSelectShareButton.bind(this);
  }

  async onInterested(event) {
    event.preventDefault();
    await this.props.interestEvent(this.props.data._id)
      .then(() => this.setState({ isInterested: true }))
      .catch(() => this.setState({ isInterested: false }));
  }

  onLike(evt) {
    evt.preventDefault();
    this.props.data.isLiked ? this.props.unlikePost(this.props.data._id) : this.props.likePost(this.props.data._id);
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

  onSelectShareButton = (eventKey, event) => {
    event.preventDefault();
    const {
      data: {
        _id,
        sharing,
      },
      sharingPostEvent = doNothing,
    } = this.props;
    sharingPostEvent(_id, sharing || this.props.data, eventKey || null);
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
        type,
        event,
      },
      userInfo,
      loadMoreComments,
      createNewComment,
      sharingPostModalOpenned,
    } = this.props;
    const IS_POST_TYPE_STATUS = type === POST_TYPE_STATUS;
    const IS_POST_TYPE_EVENT = type === POST_TYPE_EVENT;
    const isInterested = (IS_POST_TYPE_EVENT && Array.isArray(event.interests) && event.interests.filter(u => u._id === userInfo._id).length > 0) || this.state.isInterested;

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

              { !sharing && ((user && (user._id !== author._id)) || building) &&
                <span style={{ margin: '0 6px' }}>
                  <i className="fa fa-caret-right" aria-hidden="true"></i>
                </span>
              }

              { !sharing && !building && user && (user._id !== author._id) && <Link to={`/user/${user._id}`}>
                <strong>{`${user.profile.firstName} ${user.profile.lastName}`}</strong>
              </Link>
              }
              { !sharing && building && <Link to={`/building/${building._id}`}>
                <strong>{building.name}</strong>
              </Link>
              }
            </span>
          }
          sharingPostTitle={
            <span>
              {sharing && author._id !== sharing.author._id &&
                <span>
                  { author._id !== user._id &&
                    <span>
                      đã chia sẻ bài viết với &nbsp;
                      <Link to={`/user/${user._id}`}>
                        <strong>{`${user.profile.firstName} ${user.profile.lastName}`}</strong>
                      </Link>
                    </span>
                  }
                  { author._id === user._id &&
                    <span>
                      đã chia sẻ bài viết của &nbsp;
                      <Link to={`/user/${sharing.author._id}`}>
                        <strong>{`${sharing.author.profile.firstName} ${sharing.author.profile.lastName}`}</strong>
                      </Link>
                    </span>
                  }
                </span>
              }
              { sharing && (author._id === sharing.author._id) &&
                <span>
                  { author._id !== user._id &&
                    <span>
                      đã chia sẻ bài viết với &nbsp;
                      <Link to={`/user/${user._id}`}>
                        <strong>{`${user.profile.firstName} ${user.profile.lastName}`}</strong>
                      </Link>
                    </span>
                  }
                  { author._id === user._id &&
                    <span> đã chia sẻ bài viết của mình.</span>
                  }
                </span>
              }
            </span>
          }
          subtitle={<div>
            { PUBLIC === privacy && <Icon onClick={doNothing} icons="fa fa-globe fa-1" /> }
            { FRIEND === privacy && <Icon onClick={doNothing} icons="fa fa-users fa-1" /> }
            { ONLY_ME === privacy && <Icon onClick={doNothing} icons="fa fa-lock fa-1" /> }
            { ONLY_ADMIN_BUILDING === privacy && <Icon onClick={doNothing} icons="fa fa-bell fa-1" /> }
            <Link to={`/post/${_id}`}><TimeAgo time={createdAt} /></Link>
          </div>}
          menuRight={
            (author && userInfo && (author._id === userInfo._id) && IS_POST_TYPE_STATUS) ?
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

        {message && IS_POST_TYPE_STATUS && <PostText html={message} /> }

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

        { IS_POST_TYPE_EVENT && (<Row className={s.event}>
          <Col xs={12}>
            <Col md={2} xs={4}>
              <div className={s.time}>
                <span className={s.day}>{moment(event.start).format('D')}</span>
                <span className={s.month}>{moment(event.start).format('MMM')}</span>
              </div>
            </Col>
            <Col md={10} xs={8} className={s.description}>
              <div className={s.name}><span className={s.maxWith} onClick={() => history.push(`/events/${event._id}`)}>{event.name}</span></div>
              <div className={s.location}>
                <div className={s.maxWith}>
                  <span className="time">{moment(event.start).format('h:mm A')}</span>
                  <span role="presentation" aria-hidden="true"> · </span>
                  <a href="#">tại {event.location}</a>
                </div>
                { !event.isAuthor && (<div className={classnames('pull-right', s.btnInterested)}>
                  <Button type="button" className={s.btnOverride} disabled={isInterested} onClick={this.onInterested}><i className="fa fa-star" /> Quan tâm</Button>
                </div>) }
              </div>
              <div className={s.stats}>{`${event.joins.length} người sẽ tham gia · ${event.can_joins.length} người có thể tham gia`}</div>
            </Col>
          </Col>
          <Clearfix />
        </Row>) }

        { !sharingPostModalOpenned && IS_POST_TYPE_STATUS && (
        <Divider />
        ) }

        { !sharingPostModalOpenned && IS_POST_TYPE_STATUS && (
        <PostActions>
          <Icon
            onClick={this.onLike}
            title="Thích"
            icons={`${isLiked ? s.likeColor : 'fa-heart-o'} fa fa-heart fa-lg`}
          />
          <Icon onClick={doNothing} title="Bình luận" icons="fa fa-comment-o fa-lg" />
          { /* <Icon onClick={this.onSelectShareButton} title="Chia sẻ" icons="fa fa-share fa-lg" /> */ }
          <Dropdown id={idRandom()}>
            <CustomToggle bsRole="toggle">
              <span title="Chia sẻ">
                <i className="fa fa-share fa-lg" aria-hidden="true"></i> Chia sẻ
              </span>
            </CustomToggle>
            <Dropdown.Menu onSelect={this.onSelectShareButton}>
              <MenuItem eventKey={SHARE}>Chia sẻ ...</MenuItem>
              <MenuItem eventKey={SHARE_FRIEND}>Chia sẻ trên dòng thời gian của bạn bè</MenuItem>
            </Dropdown.Menu>
          </Dropdown>
        </PostActions>
        ) }

        { !sharingPostModalOpenned && IS_POST_TYPE_STATUS && (
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
    isLiked: PropTypes.bool,
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
  likePost: PropTypes.func.isRequired,
  unlikePost: PropTypes.func.isRequired,
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

const eventFragment = gql`fragment EventDetails on Event {
    _id
    name
    location
    start
    end
    invites {
      _id
      username
      profile {
        picture
        firstName
        lastName
      }
    }
    joins {
      _id
      username
      profile {
        picture
        firstName
        lastName
      }
    }
    can_joins {
      _id
      username
      profile {
        picture
        firstName
        lastName
      }
    }
    cant_joins {
      _id
      username
      profile {
        picture
        firstName
        lastName
      }
    }
    interests {
      _id
      username
      profile {
        picture
        firstName
        lastName
      }
    }
    isAuthor
  }
`;

Feed.fragments = {
  comment: commentFragment,
  requests: gql`
    fragment UsersAwaitingApproval on RequestsToJoinBuilding {
      _id
      type
      status
      user {
        _id
        email {
          address
          verified
        }
        phone {
          number
          verified
        }
        profile {
          picture
          firstName
          lastName
          gender
        }
      }
      building {
        _id
        name
        address {
          basisPoint
          province
          district
          ward
          street
        }
      }
      requestInformation {
        apartments {
          _id
          name
        }
      }
    }
  `,
  // user: userFragment,
  post: gql`
    fragment PostView on Post {
      _id
      message
      type
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
        type
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
      event {
        ...EventDetails
      }
    }
    ${commentFragment}
    ${eventFragment}
  `,
};

Feed.mutation = {
  editPost: gql`mutation editPost ($postId: String!, $message: String!, $photos: [String], $privacy: String, $isDelPostSharing: Boolean!) {
    editPost(_id: $postId, message: $message, photos: $photos, privacy: $privacy, isDelPostSharing: $isDelPostSharing) {
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
  sharingPost: gql`mutation sharingPost ($_id: String!, $privacy: String!, $message: String!, $friendId: String, $userId: String) {
    sharingPost(_id: $_id, privacy: $privacy, message: $message, friendId: $friendId, userId: $userId) {
      ...PostView
    }
  }
  ${Feed.fragments.post}
  `,
};

export default compose(
  withStyles(s),
  graphql(interestEvent, {
    props: ({ mutate }) => ({
      interestEvent: eventId => mutate({
        variables: {
          eventId,
        },
      }),
    }),
  }),
  graphql(Feed.mutation.likePost, {
    props: ({ mutate }) => ({
      likePost: postId => mutate({
        variables: {
          postId,
        },
      }),
    }),
  }),
  graphql(Feed.mutation.unlikePost, {
    props: ({ mutate }) => ({
      unlikePost: postId => mutate({
        variables: {
          postId,
        },
      }),
    }),
  }),
)(Feed);
