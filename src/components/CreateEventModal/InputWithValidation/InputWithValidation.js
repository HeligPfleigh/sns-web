import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
        <div className={this.state.showHelper ? s.wrapperError : s.wrapperNormal}>
          <input
            id={id}
            value={this.state.value}
            className={s.inputText}
            type="text"
            onChange={this.onChange}
          />
        </div>
        {this.state.showHelper ? <div className={s.errorText}>{helpText}</div> : null}
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

