import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {
  Col,
  Image,
  Button,
} from 'react-bootstrap';
import s from './EventItem.scss';
import history from '../../../core/history';

class EventItem extends Component {

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

  onDisInterestClicked = () => {
    const { event } = this.props;
    this.props.disInterestEvent(event._id);
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
              { user.id !== event.author._id &&
                <div className={s.wrapperButtonRight}>
                  {
                    !event.isInterest ?
                      <Button
                        className={s.BtnCare}
                        onClick={this.onInterestClicked}
                      >
                        <i className="fa fa-star" aria-hidden="true" style={{ marginRight: 5 }}></i>
                        Quan tâm
                      </Button> :
                      <Button
                        className={s.BtnCare}
                        onClick={this.onDisInterestClicked}
                      >
                        <i className="fa fa-star" aria-hidden="true" style={{ marginRight: 5 }}></i>
                        Hủy quan tâm
                      </Button>
                  }
                </div>
              }
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
  disInterestEvent: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

export default withStyles(s)(EventItem);

