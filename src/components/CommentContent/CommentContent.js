import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
// import s from './CommentContent.scss';
import s from './CommentContent.css';

const CommentContent = ({ name }) => (
  <div>
    {`Hi ${name}`}
  </div>
);

CommentContent.propTypes = {
  name: PropTypes.string.isRequired,
};

export default withStyles(s)(CommentContent);
// export default CommentContent;
