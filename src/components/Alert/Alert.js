import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal } from 'react-bootstrap';
import { openAlertGlobal } from '../../reducers/alert';

class Alert extends Component {

  componentWillMount() {
    this.setState({
      open: this.props.open,
      message: this.props.message,
    });
  }

  componentDidMount() {
    if (this.state.open) {
      this.setAutoHideTimer();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.open && nextProps.open &&
        (nextProps.message !== this.props.message)) {
      this.setState({
        open: false,
      });

      clearTimeout(this.timerOneAtTheTimeId);
      this.timerOneAtTheTimeId = setTimeout(() => {
        this.setState({
          message: nextProps.message,
          open: true,
        });
      }, 400);
    } else {
      const open = nextProps.open;

      this.setState({
        open: open !== null ? open : this.state.open,
        message: nextProps.message,
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.open !== this.state.open) {
      if (this.state.open) {
        this.setAutoHideTimer();
      } else {
        clearTimeout(this.timerAutoHideId);
      }
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timerAutoHideId);
    clearTimeout(this.timerOneAtTheTimeId);
  }

  // Timer that controls delay before snackbar auto hides
  setAutoHideTimer() {
    const autoHideDuration = this.props.autoHideDuration;

    if (autoHideDuration > 0) {
      clearTimeout(this.timerAutoHideId);
      this.timerAutoHideId = setTimeout(() => {
        this.setState({ open: false });
      }, autoHideDuration);
    }
  }

  close = () => {
    this.setState({ open: false });
    clearTimeout(this.timerAutoHideId);
    clearTimeout(this.timerOneAtTheTimeId);
    this.props.openAlertGlobalAction({
      // message: 'Bạn đã chia sẽ được thành công trên dòng thời gian của bạn',
      open: false,
      autoHideDuration: 0,
    });
  }

  render() {
    const {
      message,
      open,
    } = this.state;
    // if (open && message !== '') {
    return (
      <div className="danger">
        <Modal show={open} onHide={this.close}>
          {/** <Modal.Header closeButton></Modal.Header> */}
          <Modal.Body className="text-center">
            { message }
          </Modal.Body>
        </Modal>
      </div>
    );
    // }
    // return null;
  }
}

Alert.propTypes = {
  open: PropTypes.bool.isRequired,
  message: PropTypes.node.isRequired,
  autoHideDuration: PropTypes.number,
  openAlertGlobalAction: PropTypes.func,
};
Alert.defaultProps = {
  autoHideDuration: 3000,
};

export default connect(
  state => ({
    message: state.alert.message,
    open: state.alert.open,
    autoHideDuration: state.alert.autoHideDuration,
  }),
  { openAlertGlobalAction: openAlertGlobal },
)(Alert);
