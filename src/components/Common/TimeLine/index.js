import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import TimeContent from './TimeContent';
import TimeEvent from './TimeEvent';
import s from './TimeLine.scss';

class TimeLine extends Component {

  static propTypes = {
    events: PropTypes.array.isRequired,
  };
  render() {
    return (
      <div >
        <div className={s.line}>
          {this.props.events.map(data => (
            <div key={1}>
              <TimeEvent time={data.time} />
              <TimeContent images={data.images} />
            </div>
              ))
          }


        </div>
      </div>
    );
  }
}

export default withStyles(s)(TimeLine);
