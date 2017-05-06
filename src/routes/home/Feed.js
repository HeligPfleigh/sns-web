import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Image } from 'react-bootstrap';
import Post, { PostHeader, PostText, PostActions, PostContent } from '../../components/Card';
import Icon from '../../components/Icon';
import TimeAgo from '../../components/TimeAgo';
import Divider from '../../components/Divider';
import CommentList from '../../components/Comments/CommentList';
import s from './Feed.scss';

function doNothing(e) {
  e.preventDefault();
}

const Feed = ({ data: { _id, message, user, totalLikes, isLiked, totalComments, createdAt }, likePostEvent, unlikePostEvent, loadMoreComment, userInfo }) => (
  <Post>
    <PostHeader
      avatar={
        <a href="#link-to-profile">
          <Image src={user.profile.picture} circle />
        </a>
      }
      title={
        <a href="#link-to-profile">
          <strong>{`${user.profile.firstName} ${user.profile.lastName}`}</strong>
        </a>
      }
      subtitle={<TimeAgo time={createdAt} />}
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
      <Icon onClick={(e) => { e.preventDefault(); }} title="Bình luận" icons="fa fa-comment-o fa-lg" />
      <Icon onClick={(e) => { e.preventDefault(); }} title="Chia sẻ" icons="fa fa-share fa-lg" />
    </PostActions>
    <PostContent className={s.commentPanel}>
      <CommentList isFocus={false} postId={_id} user={userInfo} loadMoreComment={loadMoreComment}/>
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
  }),
  likePostEvent: PropTypes.func.isRequired,
  unlikePostEvent: PropTypes.func.isRequired,
  userInfo: PropTypes.shape({
    _id: PropTypes.string,
    profile: PropTypes.shape({
      picture: PropTypes.string,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
    }),
  }),
  loadMoreComment: PropTypes.func.isRequired,
};

export default withStyles(s)(Feed);
