import React, { Component, PropTypes } from 'react';
import { generate as idRandom } from 'shortid';
import DeletePostModal from './DeletePostModal';
import { DELETE_POST_ACTION } from '../../constants';
import Feed from './Feed';

class FeedList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      show: false,
      idDeletedPost: null,
    };
  }

  updateStateModal = (value) => {
    this.setState(() => ({
      show: value,
    }));
  }

  closeModal = () => {
    this.updateStateModal(false);
    this.setState(() => ({
      idDeletedPost: null,
    }));
  }

  onClickModal = (evt) => {
    evt.preventDefault();
    this.closeModal();
    this.props.deletePost(this.state.idDeletedPost);
  }

  onSelectRightEvent = (eventKey, id) => {
    this.setState(() => ({
      idDeletedPost: id,
    }));
    if (DELETE_POST_ACTION === eventKey) {
      this.openModal();
    }
  }

  openModal = () => {
    this.updateStateModal(true);
  }

  render() {
    const {
      feeds,
      likePostEvent,
      unlikePostEvent,
      userInfo,
      loadMoreComments,
      createNewComment,
    } = this.props;
    return (
      <div>
        {feeds.map(item => (
          <Feed
            key={idRandom()}
            data={item}
            likePostEvent={likePostEvent}
            unlikePostEvent={unlikePostEvent}
            onSelectRightEvent={this.onSelectRightEvent}
            userInfo={userInfo}
            loadMoreComments={loadMoreComments}
            createNewComment={createNewComment}
          />
        ))}
        <DeletePostModal
          show={this.state.show}
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
  deletePost: PropTypes.func.isRequired,
};

export default FeedList;
