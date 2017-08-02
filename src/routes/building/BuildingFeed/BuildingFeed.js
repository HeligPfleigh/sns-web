import React from 'react';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroller';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import FeedList from '../../../components/Feed';
import NewPost from '../../../components/NewPost';
import { PUBLIC, ONLY_ADMIN_BUILDING } from '../../../constants';
import s from './BuildingFeed.scss';

export const BuildingFeed = ({
  createNewPostOnBuilding,
  building,
  likePost,
  unlikePost,
  me,
  loadMoreComments,
  createNewComment,
  deletePostOnBuilding,
  editPost,
  sharingPost,
}) => (
  <div>
    <NewPost
      createNewPost={createNewPostOnBuilding}
      privacy={[
        {
          name: PUBLIC,
          glyph: 'globe',
        },
        {
          name: ONLY_ADMIN_BUILDING,
          glyph: 'phone-alt',
        },
      ]}
    />
    <InfiniteScroll
      loadMore={this.loadMoreRows}
      hasMore={building.posts.pageInfo.hasNextPage}
      loader={<div className="loader">Loading ...</div>}
    >
      { building && building.posts && <FeedList
        feeds={building ? building.posts.edges : []}
        likePostEvent={likePost}
        unlikePostEvent={unlikePost}
        userInfo={me}
        loadMoreComments={loadMoreComments}
        createNewComment={createNewComment}
        deletePost={deletePostOnBuilding}
        editPost={editPost}
        sharingPost={sharingPost}
      />}
    </InfiniteScroll>
  </div>
);

BuildingFeed.propTypes = {
  createNewPostOnBuilding: PropTypes.func.isRequired,
  building: PropTypes.object.isRequired,
  me: PropTypes.object.isRequired,
  likePost: PropTypes.func.isRequired,
  unlikePost: PropTypes.func.isRequired,
  createNewComment: PropTypes.func.isRequired,
  loadMoreComments: PropTypes.func.isRequired,
  deletePostOnBuilding: PropTypes.func.isRequired,
  // buildingId: PropTypes.string.isRequired,
  editPost: PropTypes.func.isRequired,
  sharingPost: PropTypes.func.isRequired,
};

export default withStyles(s)(BuildingFeed);
