import React, { PropTypes } from 'react';
import s from './BottomButtonGroup.scss';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Button } from 'react-bootstrap';
import CreateEventModal from '../CreateEventModal';

class BottomButtonGroup extends React.Component {
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
      <div>
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
BottomButtonGroup.propTypes = {
  // onCreateEventClick: PropTypes.func.isRequired,
};

export default withStyles(s)(BottomButtonGroup);
