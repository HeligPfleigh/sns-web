import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import s from './TimeLine.scss';

class TimeEvent extends Component {

  static propTypes = {
    time: PropTypes.string.isRequired,
  };
  render() {
    return (
      <div className={s.layoutEvent}>


        <div className={s.pin} >

        </div>
        <div className={s.time}>
          {this.props.time}
        </div>


      </div>
    );
  }
}

export default withStyles(s)(TimeEvent);
