import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Post, { PostHeader, PostText, PostActions, PostContent } from '../../components/Card';
import Icon from '../../components/Icon';
import TimeAgo from '../../components/TimeAgo';
import Divider from '../../components/Divider';
import s from './Feed.scss';

const Feed = () => (
  <Post>
    <PostHeader
      title={
        <a href="#link-to-profile">
          <strong>Hoang Nam</strong>
        </a>
      }
      subtitle={<TimeAgo time={new Date()} />}
    />
    <PostText html='{"entityMap":{},"blocks":[{"key":"80f04","text":"12313","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}]}'>
      ádadasd
    </PostText>
    <PostText className={s.postStatistic}>
      <a href="#">10 Thích</a>
      <a href="#">0 Bình luận</a>
    </PostText>
    <Divider />
    <PostActions>
      <Icon onClick={(e) => { e.preventDefault(); alert('liked'); }} title="Thích" icons="fa fa-heart fa-lg" />
      <Icon onClick={(e) => { e.preventDefault(); alert('comment'); }} title="Bình luận" icons="fa fa-comment-o fa-lg" />
      <Icon onClick={(e) => { e.preventDefault(); alert('share'); }} title="Chia sẻ" icons="fa fa-share fa-lg" />
    </PostActions>
    <PostContent className={s.commentPanel}>
      Comment
    </PostContent>
  </Post>
);

Feed.propTypes = {

};

export default withStyles(s)(Feed);
