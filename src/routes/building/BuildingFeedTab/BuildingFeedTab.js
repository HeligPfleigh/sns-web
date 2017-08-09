import React, { Component } from 'react';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroller';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import FeedList from '../../../components/Feed';
import NewPost from '../../../components/NewPost';
import { PUBLIC, ONLY_ADMIN_BUILDING } from '../../../constants';
import s from './BuildingFeedTab.scss';

class BuildingFeedTab extends Component {

  render() {
    const {
      createNewPostOnBuilding,
      loadMoreFeeds,
      building,
      likePost,
      unlikePost,
      me,
      loadMoreComments,
      createNewComment,
      deletePostOnBuilding,
      editPost,
      sharingPost,
    } = this.props;
    return (
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
              glyph: 'bell',
            },
          ]}
        />
        <InfiniteScroll
          loadMore={loadMoreFeeds}
          hasMore={building.posts.pageInfo.hasNextPage}
          loader={<div className="loader">Loading ...</div>}
        >
          <FeedList
            feeds={building ? building.posts.edges : []}
            likePostEvent={likePost}
            unlikePostEvent={unlikePost}
            userInfo={me}
            loadMoreComments={loadMoreComments}
            createNewComment={createNewComment}
            deletePost={deletePostOnBuilding}
            editPost={editPost}
            sharingPost={sharingPost}
            isBuilding
          />
        </InfiniteScroll>
      </div>
    );
  }
}

BuildingFeedTab.propTypes = {
  createNewPostOnBuilding: PropTypes.func.isRequired,
  building: PropTypes.object.isRequired,
  me: PropTypes.object.isRequired,
  likePost: PropTypes.func.isRequired,
  unlikePost: PropTypes.func.isRequired,
  loadMoreFeeds: PropTypes.func.isRequired,
  createNewComment: PropTypes.func.isRequired,
  loadMoreComments: PropTypes.func.isRequired,
  deletePostOnBuilding: PropTypes.func.isRequired,
  // buildingId: PropTypes.string.isRequired,
  editPost: PropTypes.func.isRequired,
  sharingPost: PropTypes.func.isRequired,
};

export default withStyles(s)(BuildingFeedTab);
