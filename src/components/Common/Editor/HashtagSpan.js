import React from 'react';
import PropTypes from 'prop-types';

const styles = {
  hashtag: {
    color: 'rgba(95, 184, 138, 1.0)',
  },
};

const HashtagSpan = (props) => {
  const result = (
    <span style={styles.hashtag} data-offset-key={props.offsetKey}>
      {props.children}
    </span>
  );
  return result;
};

HashtagSpan.defaultProps = {
  offsetKey: null,
  children: null,
};

HashtagSpan.propTypes = {
  offsetKey: PropTypes.string,
  children: PropTypes.arrayOf(PropTypes.any),
};

export default HashtagSpan;
