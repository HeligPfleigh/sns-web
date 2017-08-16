import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './EventItem.scss';
import history from '../../../core/history';
import {
  Col,
  Image,
  Button,
} from 'react-bootstrap';

class EventItem extends React.Component {

  onInterestClicked = () => {
    const { user, event } = this.props;
    let newInterest = [];
    newInterest = event.interests.slice();
    newInterest.push({
      _id: user._id,
      username: user.username,
      profile: user.profile,
    });
    this.props.interestEvent(event._id, newInterest);
  }

  render() {
    const { event, user } = this.props;
    const start = new Date(event.start);
    return (
      <Col
        style={{
          cursor: 'pointer',
          marginBottom: 10,
        }}
        md={6}
      >
        <div className={s.eventItem}>
          <div className={s.photo}>
            <Image
              src={event.photos[0]}
              style={{
                cursor: 'pointer',
              }}
              responsive
              onClick={async () => {
                history.push(`/events/${event._id}`);
              }}
            />
          </div>
          <div className={s.bottom}>
            <div
              className={s.calendar}
              style={{
                cursor: 'pointer',
              }}
              onClick={async () => {
                history.push(`/events/${event._id}`);
              }}
            >
              <p className={s.month}>{`THÁNG ${start.getMonth() + 1}`}</p>
              <h5 className={s.day}>{start.getDate()}</h5>
            </div>
            <div className={s.contentSmall}>
              <p
                style={{
                  cursor: 'pointer',
                }}
                onClick={async () => {
                  history.push(`/events/${event._id}`);
                }}
                className={s.title}
              >{event.name}</p>
              <p
                style={{
                  cursor: 'pointer',
                }}
                onClick={async () => {
                  history.push(`/events/${event._id}`);
                }}
                className={s.location}
              >{event.location}</p>
              <p
                style={{
                  cursor: 'pointer',
                }}
                onClick={async () => {
                  history.push(`/events/${event._id}`);
                }}
                className={s.care}
              >{`${event.interests.length} Người quan tâm`}</p>
              <div className={s.wrapperButtonRight}>
                {
                  !event.isInterest && user.id !== event.author._id ?
                    <Button
                      className={s.BtnCare}
                      onClick={this.onInterestClicked}
                    >
                      <i className="fa fa-star" aria-hidden="true" style={{ marginRight: 5 }}></i>
                      Quan tâm
                    </Button> :
                    <Button
                      disabled
                      className={s.BtnCare}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        height: 33,
                      }}
                    />
                }

              </div>
            </div>
          </div>
        </div>
      </Col>
    );
  }
}

EventItem.propTypes = {
  event: PropTypes.object.isRequired,
  interestEvent: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

export default withStyles(s)(EventItem);

