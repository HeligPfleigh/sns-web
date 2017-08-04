import React, { PropTypes } from 'react';
import { graphql, compose } from 'react-apollo';
import { Button } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './EventMenu.scss';
import MenuVertical from '../../MenuVertical';
import CreateEventModal from '../../CreateEventModal';

const currentDate = new Date();

const menus = [{
  text: 'Sự kiện',
  key: 'event',
}, {
  text: 'Quá khứ',
  key: 'past',
}, {
  text: 'Lịch',
  key: 'calendar',
}];

class EventMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showCreateEventModal: false,
    };
  }


  onMenuSelected = (idx) => {
    console.log(idx);
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

  render() {
    const { showCreateEventModal } = this.state;
    return (
      <div>
        <CreateEventModal
          show={showCreateEventModal}
          closeModal={this.closeModal}
        />
        <i className={`${s.iconCalender} fa fa-calendar-o`} aria-hidden="true">
          <span>{currentDate.getDay()}</span>
        </i>
        <span className={s.eventTitle}>Sự Kiện</span>
        <MenuVertical
          menus={menus}
          onItemSelected={(idx) => { this.onMenuSelected(idx); }}
        />
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

