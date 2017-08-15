import React from 'react';
import PropTypes from 'prop-types';

const UserValue = ({ value, children }) => (
  <div className="Select-value" title={value.title}>
    <span className="Select-value-label">
      <strong>{children}</strong>
    </span>
  </div>
);

UserValue.propTypes = {
  children: PropTypes.node,
  value: PropTypes.object,
};

export default UserValue;
