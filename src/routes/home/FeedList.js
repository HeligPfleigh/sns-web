import React, { PropTypes } from 'react';
import Feed from './Feed';

const FeedList = ({ feeds, likePostEvent, unlikePostEvent, userInfo, loadMoreComments, createNewComment }) => (
  <div>
    {feeds.map(item => (
      item.user && item.user.profile && <Feed
        key={item._id}
        data={item}
        likePostEvent={likePostEvent}
        unlikePostEvent={unlikePostEvent}
        userInfo={userInfo}
        loadMoreComments={loadMoreComments}
        createNewComment={createNewComment}
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
