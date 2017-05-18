import React, { PropTypes, Component } from 'react';
import { convertFromRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Image, Col } from 'react-bootstrap';

import Link from '../../Link';
import TimeAgo from '../../TimeAgo';
import s from './CommentItem.scss';

class CommentItem extends Component {

  showCommentFormHandle = (e) => {
    e.preventDefault();
    const { comment } = this.props;
    this.props.showCommentForm(comment);
  }

  render() {
    const { comment } = this.props;
    const link = `/user/${comment.user._id}`;
    return (
      <div className={s.commentPanel}>
        <Col className={s.commentAvarta}>
          <Link to={`/user/${comment.user._id}`}>
            <Image src={comment.user.profile.picture} circle />
          </Link>
        </Col>
        <Col className={s.commentContent}>
          <Col
            dangerouslySetInnerHTML={{
              __html: `<p><a href=${link}>${comment.user.profile.firstName} ${comment.user.profile.lastName}<a/></p>
              ${stateToHTML(convertFromRaw(JSON.parse(comment.message)))}`,
            }}
          />
          <Col className={s.commentControl}>
            <a href="#" onClick={this.showCommentFormHandle}>Trả lời</a> - <a href="#">
              <TimeAgo time={comment.updatedAt} />
            </a>
          </Col>
        </Col>
      </div>
    );
  }
}

CommentItem.propTypes = {
  comment: PropTypes.object.isRequired,
  showCommentForm: PropTypes.func.isRequired,
};

export default withStyles(s)(CommentItem);
