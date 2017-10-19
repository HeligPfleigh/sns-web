import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { convertFromRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { Image, Col } from 'react-bootstrap';
import { Link as AnchorLink } from 'react-scroll';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import Link from '../../../Link';
import TimeAgo from '../../../TimeAgo';
import s from './CommentItem.scss';

class CommentItem extends Component {

  showCommentFormHandle = (e) => {
    e.preventDefault();
    const { comment } = this.props;
    this.props.showCommentForm(comment);
  }

  render() {
    const { comment, offset } = this.props;
    const link = `/user/${comment.user._id}`;

    return (
      <div className={s.commentPanel}>
        <Col className={s.commentAvarta}>
          <Link
            to={`/user/${comment.user._id}`}
            title={`${comment.user.profile.firstName} ${comment.user.profile.lastName}`}
          >
            <Image src={comment.user.profile.picture} circle />
          </Link>
        </Col>
        <Col className={s.commentContent}>
          <Col
            dangerouslySetInnerHTML={{
              __html: `<p>
                <a title="${comment.user.profile.firstName} ${comment.user.profile.lastName}" href=${link}>
                  ${comment.user.profile.firstName} ${comment.user.profile.lastName}
                </a></p>
                ${stateToHTML(convertFromRaw(JSON.parse(comment.message)))}
              `,
            }}
          />
          <Col className={s.commentControl}>
            <AnchorLink to={`#add-comment-${comment.parent || comment._id}`} offset={offset} smooth onClick={this.showCommentFormHandle}>
              <i className="fa fa-comment-o fa-lg" /> Trả lời
            </AnchorLink>
            - <TimeAgo time={comment.updatedAt} />
          </Col>
        </Col>
      </div>
    );
  }
}

CommentItem.propTypes = {
  offset: PropTypes.number,
  comment: PropTypes.object.isRequired,
  showCommentForm: PropTypes.func.isRequired,
};

export default withStyles(s)(CommentItem);
