import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { generate as idRandom } from 'shortid';
import DeletePostModal from './DeletePostModal';
import SharingPostModal from './SharingPostModal';
import { DELETE_POST_ACTION } from '../../constants';
import { openAlertGlobal } from '../../reducers/alert';
import Feed from './Feed';

function doNothing(e) {
  e && e.preventDefault && e.preventDefault();
}

class FeedList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      show: false,
      showSharingPost: false,
      idDeletedPost: null,
      idSharingPost: null,
    };
  }

  onClickModal = (evt) => {
    evt.preventDefault();
    const { idDeletedPost, idSharingPost } = this.state;
    const { openAlertGlobalAction } = this.props;
    this.closeModal();
    if (idDeletedPost) {
      this.props.deletePost(idDeletedPost);
    }
    if (idSharingPost) {
      this.props
      .sharingPost(idSharingPost)
      .then(({ data }) => {
        console.log('got data', data);
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
    const { idDeletedPost, idSharingPost } = this.state;
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
  }

  openModal = () => {
    this.updateStateModal(true);
  }

  sharingPostEvent = (id) => {
    this.setState(() => ({
      showSharingPost: true,
      idSharingPost: id,
    }));
  }

  render() {
    const {
      feeds,
      likePostEvent,
      unlikePostEvent,
      userInfo,
      loadMoreComments,
      createNewComment,
      editPost = doNothing,
    } = this.props;
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
            editPostEvent={editPost}
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
  deletePost: PropTypes.func,
  editPost: PropTypes.func, // (user page)
  sharingPost: PropTypes.func.isRequired,
  openAlertGlobalAction: PropTypes.func,
};

export default connect(
  null,
  { openAlertGlobalAction: openAlertGlobal },
)(FeedList);
