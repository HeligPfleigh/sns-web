import React, { PropTypes, Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Clearfix } from 'react-bootstrap';
import ScrollableAnchor, { configureAnchors, goToAnchor } from 'react-scrollable-anchor';
import s from './CommentStyle.scss';
import CommentItem from './CommentItem';
import NewComment from './NewComment';

configureAnchors({ offset: -160, scrollDuration: 200 });

class CommentList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      commentId: null,
      isSubForm: false,
    };
    if (process.env.BROWSER) {
      window.goToAnchor = goToAnchor;
    }
  }

  showCommentForm = ({ _id, parent, user }) => {
    const content = `@${user.username} - `;
    this.setState({
      initContent: parent ? content : '',
      commentId: parent || _id,
      isSubForm: !this.setState.isSubForm,
    });
  }

  hasMore = () => {
    const { totalComments, comments } = this.props;
    return totalComments > comments.length;
  }

  loadMoreComments = (evt) => {
    evt.preventDefault();
    const comments = this.props.comments ? this.props.comments : [];
    let commentId = null;
    if (comments.length !== 0) {
      commentId = comments[0]._id;
    }
    this.props.loadMoreComments(commentId, this.props.postId);
  }

  render() {
    const { postId, isFocus, user, comments } = this.props;
    const { initContent, commentId, isSubForm } = this.state;

    return (
      <div>
        {this.hasMore() && <a
          onClick={this.loadMoreComments} style={{
            fontSize: 12,
          }}
        >Xem thêm</a>
        }
        {comments.map(item => (
          <span key={item._id}>
            <CommentItem comment={item} showCommentForm={this.showCommentForm} />
            {item && item.reply && item.reply.map(_item => (
              <span className={s.subComment} key={_item._id}>
                <CommentItem comment={_item} showCommentForm={this.showCommentForm} />
              </span>
            ))}
            { commentId === item._id && <ScrollableAnchor id={`#add-comment-${item._id}`}>
              123
              <span className={s.subComment}>
                <NewComment
                  initContent={initContent}
                  commentId={commentId}
                  isFocus={isSubForm}
                  user={user}
                  postId={postId}
                  createNewComment={this.props.createNewComment}
                />
              </span>
            </ScrollableAnchor> }
          </span>
        ))}
        <Clearfix />
        <ScrollableAnchor id={`#add-comment-${postId}`}>
          <NewComment isFocus={isFocus} user={user} postId={postId} createNewComment={this.props.createNewComment} />
        </ScrollableAnchor>
      </div>
    );
  }
}

CommentList.propTypes = {
  comments: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
  })).isRequired,
  postId: PropTypes.string.isRequired,
  isFocus: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
  createNewComment: PropTypes.func.isRequired,
  loadMoreComments: PropTypes.func.isRequired,
  totalComments: PropTypes.number.isRequired,
};

export default withStyles(s)(CommentList);
