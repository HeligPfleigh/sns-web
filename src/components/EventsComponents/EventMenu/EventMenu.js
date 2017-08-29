import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'react-apollo';
import { Button } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import history from '../../../core/history';
import s from './EventMenu.scss';
// import MenuVertical from '../../MenuVertical';
import CreateEventModal from '../../CreateEventModal';

const currentDate = new Date();

// const menus = [{
//   text: 'Sự kiện',
//   key: 'event',
// }, {
//   text: 'Quá khứ',
//   key: 'past',
// }, {
//   text: 'Lịch',
//   key: 'calendar',
// }];

class EventMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCreateEventModal: false,
    };
  }


  onMenuSelected = () => {
  }

  onCreateEvent = () => {
    this.setState({
      showCreateEventModal: true,
    });
  }

  closeModal = () => {
    this.setState({
      showCreateEventModal: false,
    });
  }

  goEventsHome = () => {
    history.push('/events');
  }

  render() {
    const { showCreateEventModal } = this.state;
    return (
      <div className={s.menuLeftClass}>
        <CreateEventModal
          show={showCreateEventModal}
          closeModal={this.closeModal}
        />
        <span className={s['events-home']} onClick={this.goEventsHome}>
          <i className={`fa fa-calendar-o ${s.iconCalender}`} aria-hidden="true">
            <span>{currentDate.getDate()}</span>
          </i>
          <span className={s.eventTitle}>Sự Kiện</span>
        </span>
        { /* <MenuVertical
          menus={menus}
          onItemSelected={(idx) => { this.onMenuSelected(idx); }}
        /> */}
        <Button
          onClick={this.onCreateEvent}
          className={s.btnCreateEvent}
          bsStyle="primary"
        >
          <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
          <span> Tạo sự kiện</span>
        </Button>
      </div>
    );
  }
}

EventMenu.propTypes = {
  onCreateEvent: PropTypes.func,
};

export default compose(
  withStyles(s),
)(EventMenu);

