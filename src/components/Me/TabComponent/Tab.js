
  import React, { Component, PropTypes } from 'react';
  import withStyles from 'isomorphic-style-loader/lib/withStyles';
  import { Button } from 'react-bootstrap';
  import s from './Tab.scss';
  import { MY_TIME_LINE, MY_INFO } from '../../../constants';

  class Tab extends Component {
    static propTypes = {
      onclicks: PropTypes.func.isRequired,
      stateChildShow: PropTypes.string.isRequired,
    };
    buttonClicked = state => (evt) => {
      evt.preventDefault();
      this.props.onclicks(state);
    }
    render() {
      return (
        <ul className={s.tab}>
          <li className={this.props.stateChildShow === MY_TIME_LINE ? s.active : ''}>
            <Button onClick={this.buttonClicked(MY_TIME_LINE)} bsClass={s.button}>
              Dòng thời gian
              <i className="fa fa-sort-asc"></i>
            </Button>
          </li>
          <li className={this.props.stateChildShow === MY_INFO ? s.active : ''}>
            <Button onClick={this.buttonClicked(MY_INFO)} bsClass={s.button}>
              Thông tin <i className="fa fa-sort-asc"></i>
            </Button>
          </li>
        </ul>
      );
    }
}

export default withStyles(s)(Tab);
