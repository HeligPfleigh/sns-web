import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormGroup, FormControl, HelpBlock } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './InputWithValidation.scss';

class InputWithValidation extends Component {
  state={
    value: '',
    showHelper: false,
  }

  onChange = (e) => {
    this.setState({
      value: e.target.value,
    });
    this.props.onTextChange(e.target.value);
    const result = this.props.validationState(e.target.value);
    this.setState({
      showHelper: !result,
    });
  }

  render() {
    const { id, helpText } = this.props;
    return (
      <div>
        <FormControl
          type="text"
          id={id}
          value={this.state.value}
          onChange={this.onChange}
        />
        {this.state.showHelper ? <HelpBlock>{helpText}</HelpBlock> : null}
      </div>
    );
  }
}


InputWithValidation.propTypes = {
  id: PropTypes.string.isRequired,
  validationState: PropTypes.func,
  helpText: PropTypes.string.isRequired,
  onTextChange: PropTypes.func.isRequired,
};

export default withStyles(s)(InputWithValidation);

