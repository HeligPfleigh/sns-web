import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import timeagojs from 'timeago.js';

import TimeAgo from './TimeAgo';
import vnStrings from './locales/vi';
import s from './TimeAgo.scss';

timeagojs.register('vi', vnStrings);

const TimeAgoWraper = ({ time, locale }) => (
  <TimeAgo
    datetime={time}
    locale={locale}
    className={s.time}
  />
);

TimeAgoWraper.propTypes = {
  time: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
};

TimeAgoWraper.defaultProps = {
  locale: 'vi',
};

export default withStyles(s)(TimeAgoWraper);
