import React, { Component, PropTypes } from 'react';
import { Alert } from 'react-bootstrap';

class Errors extends Component {

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

  render() {
    const {
      message,
      open,
    } = this.state;
    if (open && message !== '') {
      return (
        <Alert bsStyle="danger">
          { message }
        </Alert>
      );
    }
    return null;
  }
}

Errors.propTypes = {
  open: PropTypes.bool.isRequired,
  message: PropTypes.node.isRequired,
  autoHideDuration: PropTypes.number,
};
Errors.defaultProps = {
  autoHideDuration: 3000,
};

export default Errors;
