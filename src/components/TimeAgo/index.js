import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import TimeAgo from 'react-timeago';
import vnStrings from 'react-timeago/lib/language-strings/vi';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import s from './TimeAgo.scss';

const formatter = buildFormatter(vnStrings);

const TimeAgoWraper = ({ time }) => (
  <TimeAgo date={time} formatter={formatter} className={s.time} />
);

TimeAgoWraper.propTypes = {
  time: PropTypes.string.isRequired,
};

export default withStyles(s)(TimeAgoWraper);
