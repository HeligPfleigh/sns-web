import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import FeedListComponent from '../../../components/Feed';

class FeedList extends Component {
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
};

export default withApollo(FeedList);
