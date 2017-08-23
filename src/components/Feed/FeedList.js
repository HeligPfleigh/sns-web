import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { generate as idRandom } from 'shortid';
import DeletePostModal from './DeletePostModal';
import SharingPostModal from './SharingPostModal';
import EditPostModal from './EditPostModal';
import DiscardChangesPostModal from './DiscardChangesPostModal';
import { SHARE, PUBLIC, DELETE_POST_ACTION } from '../../constants';
import { openAlertGlobal } from '../../reducers/alert';
import Feed from './Feed';

class FeedList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      show: false,
      shareType: SHARE,
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

  onClickModal = (evt, { privacyPost, message, userId }) => {
    evt.preventDefault();

    const { idDeletedPost, idSharingPost } = this.state;
    const { openAlertGlobalAction } = this.props;
    this.closeModal();

    if (idDeletedPost) {
      this.props.deletePost(idDeletedPost);
    }

    if (idSharingPost) {
      this.props
      .sharingPost(idSharingPost, privacyPost, message, userId)
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

  sharingPostEvent = (idSharingPost, sharingFeed, shareType) => {
    this.setState({
      showSharingPost: true,
      idSharingPost,
      sharingFeed,
      shareType,
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
          friends={userInfo.friends || []}
          shareType={this.state.shareType}
        />
        <EditPostModal
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
  userInfo: PropTypes.object.isRequired,
  loadMoreComments: PropTypes.func.isRequired,
  createNewComment: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  editPost: PropTypes.func.isRequired,
  sharingPost: PropTypes.func.isRequired,
  openAlertGlobalAction: PropTypes.func,
};

export default connect(
  null,
  { openAlertGlobalAction: openAlertGlobal },
)(FeedList);
