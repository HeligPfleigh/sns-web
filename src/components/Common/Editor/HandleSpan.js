import React from 'react';
import PropTypes from 'prop-types';

const styles = {
  handle: {
    color: 'rgba(98, 177, 254, 1.0)',
    direction: 'ltr',
    unicodeBidi: 'bidi-override',
  },
};

const HandleSpan = (props) => {
  const result = (
    <span style={styles.handle} data-offset-key={props.offsetKey}>
      {props.children}
    </span>
  );
  return result;
};

HandleSpan.defaultProps = {
  offsetKey: null,
  children: null,
};

HandleSpan.propTypes = {
  offsetKey: PropTypes.string,
  children: PropTypes.arrayOf(PropTypes.any),
};

export default HandleSpan;
