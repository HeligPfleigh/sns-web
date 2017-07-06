import React, { PropTypes } from 'react';
import { generate as idRandom } from 'shortid';
import Feed from './Feed';

const FeedList = ({
  feeds,
  likePostEvent,
  unlikePostEvent,
  userInfo,
  loadMoreComments,
  createNewComment,
}) => (
  <div>
    {feeds.map(item => (
      <Feed
        key={idRandom()}
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
  loadMoreComments: PropTypes.func.isRequired,
  createNewComment: PropTypes.func.isRequired,
};

export default FeedList;
