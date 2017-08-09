import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { generate as idRandom } from 'shortid';
import DeletePostModal from './DeletePostModal';
import SharingPostModal from './SharingPostModal';
import EditPostModal from './EditPostModal';
import DiscardChangesPostModal from './DiscardChangesPostModal';
import { PUBLIC, FRIEND, ONLY_ME, ONLY_ADMIN_BUILDING, DELETE_POST_ACTION } from '../../constants';
import { openAlertGlobal } from '../../reducers/alert';
import Feed from './Feed';

class FeedList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      show: false,
      showSharingPost: false,
      showEditPost: false,
      showDiscardChangesPost: false,
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
    const { openAlertGlobalAction } = this.props;
    this.closeModal();

    if (idDeletedPost) {
      this.props.deletePost(idDeletedPost);
    }

    if (idSharingPost) {
      this.props
      .sharingPost(idSharingPost, privacyPost, message)
      .then(() => {
        openAlertGlobalAction({
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

  onClickDiscardChangesPostModal = (evt) => {
    if (evt) evt.preventDefault();
    this.setState(() => ({
      showEditPost: false,
      showDiscardChangesPost: false,
      idEditPost: null,
    }));
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

  sharingPostEvent = (idSharingPost, sharingFeed) => {
    this.setState({
      showSharingPost: true,
      idSharingPost,
      sharingFeed,
    });
  }

  editPostEvent = (id, dataPost) => {
    this.setState(() => ({
      showEditPost: true,
      idEditPost: id,
      dataPost,
    }));
  }

  discardChangesPost = () => {
    this.setState({
      showDiscardChangesPost: true,
    });
  }

  closeDiscardChangesPostModal = () => {
    this.setState({
      showDiscardChangesPost: false,
    });
  }

  render() {
    const {
      feeds,
      likePostEvent,
      unlikePostEvent,
      userInfo,
      loadMoreComments,
      createNewComment,
      isBuilding,
    } = this.props;

    let privacies = [PUBLIC, FRIEND, ONLY_ME];
    if (isBuilding) {
      privacies = [PUBLIC, ONLY_ADMIN_BUILDING];
    }

    return (
      <div>
        {feeds && feeds.map(item => (
          <Feed
            key={idRandom()}
            data={item}
            likePostEvent={likePostEvent}
            unlikePostEvent={unlikePostEvent}
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
          privacies={privacies}
          show={this.state.showEditPost}
          closeModal={this.closeModal}
          clickModal={this.onClickEditPostModal}
          dataPost={this.state.dataPost}
          showDiscardChangesPostModal={this.discardChangesPost}
          isHideModalBehindBackdrop={this.state.showDiscardChangesPost}
        />
        <DiscardChangesPostModal
          show={this.state.showDiscardChangesPost}
          closeModal={this.closeDiscardChangesPostModal}
          clickModal={this.onClickDiscardChangesPostModal}
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
  likePostEvent: PropTypes.func.isRequired,
  unlikePostEvent: PropTypes.func.isRequired,
  userInfo: PropTypes.object.isRequired,
  loadMoreComments: PropTypes.func.isRequired,
  createNewComment: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  editPost: PropTypes.func.isRequired,
  sharingPost: PropTypes.func.isRequired,
  openAlertGlobalAction: PropTypes.func,
  isBuilding: PropTypes.bool,
};

export default connect(
  null,
  { openAlertGlobalAction: openAlertGlobal },
)(FeedList);
