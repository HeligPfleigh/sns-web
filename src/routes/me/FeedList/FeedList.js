import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import FeedListComponent from '../../../components/Feed';
import likePostMutation from './likePostMutation.graphql';
import unlikePostMutation from './unlikePostMutation.graphql';

class FeedList extends Component {

  likePostEvent = (postId, message, totalLikes) => {
    const {
      queryData,
      paramData,
      feeds,
      updatePost,
    } = this.props;
    this.props.client.mutate({
      mutation: likePostMutation,
      variables: { postId },
      optimisticResponse: {
        __typename: 'Mutation',
        likePost: {
          __typename: 'PostSchemas',
          _id: postId,
        },
      },
      update: (store, { data: { likePost } }) => {
        // Read the data from our cache for this query.
        let data = store.readQuery({
          query: queryData,
          variables: paramData,
        });
        let updatedPost = likePost;
        const index = feeds.findIndex(item => item._id === updatedPost._id);
        updatedPost = Object.assign({}, feeds[index], {
          totalLikes: totalLikes + 1,
          isLiked: true,
        });

        data = updatePost(data, index, updatedPost);
        // Write our data back to the cache.
        store.writeQuery({
          query: queryData,
          variables: paramData,
          data,
        });
      },
    });
  }

  unlikePostEvent = (postId, message, totalLikes) => {
    const {
      queryData,
      paramData,
      feeds,
      updatePost,
    } = this.props;
    this.props.client.mutate({
      mutation: unlikePostMutation,
      variables: { postId },
      optimisticResponse: {
        __typename: 'Mutation',
        unlikePost: {
          __typename: 'PostSchemas',
          _id: postId,
        },
      },
      update: (store, { data: { unlikePost } }) => {
        // Read the data from our cache for this query.
        let data = store.readQuery({
          query: queryData,
          variables: paramData,
        });
        let updatedPost = unlikePost;
        const index = feeds.findIndex(item => item._id === updatedPost._id);
        updatedPost = Object.assign({}, feeds[index], {
          totalLikes: totalLikes - 1,
          isLiked: false,
        });
        data = updatePost(data, index, updatedPost);
        // Write our data back to the cache.
        store.writeQuery({
          query: queryData,
          variables: paramData,
          data,
        });
      },
    });
  }

  render() {
    const {
      feeds,
      userInfo,
      loadMoreComments,
      createNewComment,
      deletePost,
      editPost,
      sharingPost,
    } = this.props;
    return (
      <div>
        <FeedListComponent
          feeds={feeds}
          likePostEvent={this.likePostEvent}
          unlikePostEvent={this.unlikePostEvent}
          onSelectRightEvent={this.onSelectRightEvent}
          userInfo={userInfo}
          loadMoreComments={loadMoreComments}
          createNewComment={createNewComment}
          deletePost={deletePost}
          editPost={editPost}
          sharingPost={sharingPost}
        />
      </div>
    );
  }
}

FeedList.propTypes = {
  feeds: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
    }),
  ).isRequired,
  userInfo: PropTypes.object.isRequired,
  loadMoreComments: PropTypes.func.isRequired,
  createNewComment: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  editPost: PropTypes.func.isRequired,
  sharingPost: PropTypes.func.isRequired,
  queryData: PropTypes.object.isRequired,
  paramData: PropTypes.object.isRequired,
  client: PropTypes.object.isRequired,
  updatePost: PropTypes.func.isRequired,
};

export default withApollo(FeedList);
