import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import { generate as idRandom } from 'shortid';
import { DELETE_POST_ACTION, PUBLIC } from '../../../constants';
import {
  Feed,
  DeletePostModal,
  SharingPostModal,
  EditPostModal,
} from '../../../components/Feed';
import likePostMutation from './likePostMutation.graphql';
import unlikePostMutation from './unlikePostMutation.graphql';
import { openAlertGlobal } from '../../../reducers/alert';

class FeedList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      show: false,
      showSharingPost: false,
      showEditPost: false,
      idDeletedPost: null,
      idSharingPost: null,
      idEditPost: null,
      privacyPost: PUBLIC,
      sharingFeed: {},
      dataPost: {},
    };
  }

  onClickModal = (evt, { privacyPost, message }) => {
    evt.preventDefault();

    const { idDeletedPost, idSharingPost } = this.state;
    this.closeModal();
    if (idDeletedPost) {
      this.props.deletePost(idDeletedPost);
    }
    if (idSharingPost) {
      this.props.sharingPost(idSharingPost, privacyPost, message).then(({ data }) => {
        openAlertGlobal({
          message: 'Bạn đã chia sẽ được thành công trên dòng thời gian của bạn',
          open: true,
          autoHideDuration: 0,
        });
      }).catch((error) => {
        console.log('there was an error sending the query', error);
      });
    }
  }

  onClickEditPostModal = (evt, post, isDelPostSharing) => {
    evt.preventDefault();
    if (post._id) {
      this.props.editPost(post, isDelPostSharing);
    }
    this.closeModal();
  }

  onSelectRightEvent = (eventKey, id) => {
    this.setState(() => ({
      idDeletedPost: id,
    }));
    if (DELETE_POST_ACTION === eventKey) {
      this.openModal();
    }
  }

  updateStateModal = (value) => {
    this.setState(() => ({
      show: value,
    }));
  }


  closeModal = () => {
    this.updateStateModal(false);
    const { idDeletedPost, idSharingPost, idEditPost } = this.state;
    if (idDeletedPost) {
      this.setState(() => ({
        idDeletedPost: null,
      }));
    }
    if (idSharingPost) {
      this.setState(() => ({
        showSharingPost: false,
        idSharingPost: null,
      }));
    }
    if (idEditPost) {
      this.setState(() => ({
        showEditPost: false,
        idEditPost: null,
      }));
    }
  }

  openModal = () => {
    this.updateStateModal(true);
  }

  sharingPostEvent = (id, sharingFeed) => {
    this.setState(() => ({
      showSharingPost: true,
      idSharingPost: id,
      sharingFeed,
    }));
  }

  editPostEvent = (id, dataPost) => {
    this.setState(() => ({
      showEditPost: true,
      idEditPost: id,
      dataPost,
    }));
  }

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
    } = this.props;
    return (
      <div>
        {feeds && feeds.map(item => (
          <Feed
            key={idRandom()}
            data={item}
            likePostEvent={this.likePostEvent}
            unlikePostEvent={this.unlikePostEvent}
            onSelectRightEvent={this.onSelectRightEvent}
            userInfo={userInfo}
            loadMoreComments={loadMoreComments}
            createNewComment={createNewComment}
            editPostEvent={this.editPostEvent}
            sharingPostEvent={this.sharingPostEvent}
          />
        ))}
        <DeletePostModal
          show={this.state.show}
          closeModal={this.closeModal}
          clickModal={this.onClickModal}
        />
        <SharingPostModal
          show={this.state.showSharingPost}
          closeModal={this.closeModal}
          clickModal={this.onClickModal}
          sharingFeed={this.state.sharingFeed}
        />
        <EditPostModal
          show={this.state.showEditPost}
          closeModal={this.closeModal}
          clickModal={this.onClickEditPostModal}
          dataPost={this.state.dataPost}
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
