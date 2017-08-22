import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Button } from 'react-bootstrap';

import CreateEventModal from '../CreateEventModal';
import s from './BottomButtonGroup.scss';

class BottomButtonGroup extends Component {
  state = {
    showCreateEventModal: false,
  }

  onCreateEventClick = () => {
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
      <div style={{ zIndex: 999 }}>
        <CreateEventModal
          show={showCreateEventModal}
          closeModal={this.closeModal}
        />
        <div className={s.BottomButtonGroup}>
          <div>
            <Button
              onClick={this.onCreateEventClick}
              className={s.AddEventButton}
            >
              <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
              <strong> Tạo sự kiện</strong>
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(BottomButtonGroup);
