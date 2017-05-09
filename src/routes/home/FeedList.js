import React, { PropTypes } from 'react';
// import Post from '../../components/Post';
import Feed from './Feed';
/**
<Post
key={item._id}
data={item}
likePostEvent={likePostEvent}
unlikePostEvent={unlikePostEvent}
userInfo={userInfo}
isTimeLineMe={false}
/>
*/

const FeedList = ({ feeds, likePostEvent, unlikePostEvent, userInfo }) => (
  <div>
    {feeds.map(item => (
      item.user && item.user.profile && <Feed
        key={item._id}
        data={item}
        likePostEvent={likePostEvent}
        unlikePostEvent={unlikePostEvent}
        userInfo={userInfo}
      />
    ))}
  </div>
);

FeedList.propTypes = {
  feeds: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
    }),
  ).isRequired,
  likePostEvent: PropTypes.func.isRequired,
  unlikePostEvent: PropTypes.func.isRequired,
  userInfo: PropTypes.object.isRequired,
};

export default FeedList;