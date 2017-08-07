import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './EventItem.scss';
import {
  Col,
  Image,
  Button,
} from 'react-bootstrap';

class EventItem extends React.Component {
  render() {
    const { event } = this.props;
    const start = new Date(event.start);
    return (
      <Col md={6}>
        <div className={s.eventItem}>
          <div className={s.photo}>
            <Image
              src={event.photos[0]}
              responsive
            />
          </div>
          <div className={s.bottom}>
            <div className={s.calendar}>
              <p className={s.month}>{`THÁNG ${start.getMonth()}`}</p>
              <h5 className={s.day}>{start.getDay()}</h5>
            </div>
            <div className={s.contentSmall}>
              <h5 className={s.title}>{event.name}</h5>
              <p className={s.location}>{event.location}</p>
              <p className={s.care}>199 Người quan tâm</p>
              <p>
                <Button>
                  <i className="fa fa-star" aria-hidden="true" style={{ marginRight: 5 }}></i>
                    Quan tâm
                </Button>
              </p>
            </div>
          </div>
        </div>
      </Col>
    );
  }
}

EventItem.propTypes = {
  event: PropTypes.object.isRequired,
};

export default withStyles(s)(EventItem);

