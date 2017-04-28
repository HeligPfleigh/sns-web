import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import monment from 'moment';
import TimeEvent from '../TimeLine/TimeEvent';
import s from '../TimeLine/TimeLine.scss';
import PostMe from './PostMe';


class TimeLineMe extends React.Component {

  static propTypes = {
    events: PropTypes.array.isRequired,
    likePostEvent: PropTypes.func.isRequired,
    unlikePostEvent: PropTypes.func.isRequired,
    userInfo: PropTypes.object.isRequired,

  };

  render() {
    const { likePostEvent, unlikePostEvent, userInfo } = this.props;

    return (

      <div>

        <div className={s.line}>
          {this.props.events.map(data => (
            <div key={data._id}>
              <TimeEvent time={monment(data.createdAt).locale('vi').format('DD MMMM')} />
              <div >
                <div className={s.smallpin} >
                  pin
                </div>
                <div className={s.parent}>
                  <PostMe
                    isTimeLineMe
                    data={data && data}
                    userInfo={userInfo && userInfo} likePostEvent={likePostEvent && likePostEvent}
                    unlikePostEvent={unlikePostEvent && unlikePostEvent}
                  />
                </div>
              </div>
            </div>

              ))
          }


        </div>
      </div>

    );
  }
}

export default withStyles(s)(TimeLineMe);
