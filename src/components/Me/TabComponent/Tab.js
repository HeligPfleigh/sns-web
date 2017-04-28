
  import React, { PropTypes } from 'react';
  import { Button } from 'react-bootstrap';
  import withStyles from 'isomorphic-style-loader/lib/withStyles';
  import s from './Tab.scss';
  import { MY_TIME_LINE, MY_INFO, MY_PHOTO } from '../../../constants';

  class Tab extends React.Component {

    static propTypes = {
      numbers: PropTypes.number.isRequired,
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
          <li className={this.props.stateChildShow === MY_TIME_LINE ? s.active : ''}><Button onClick={this.buttonClicked(MY_TIME_LINE)} bsClass={s.button}>Dòng thời gian <i className="fa fa-sort-asc"></i></Button></li>
          <li className={this.props.stateChildShow === MY_PHOTO ? s.active : ''}><Button onClick={this.buttonClicked(MY_PHOTO)} bsClass={s.button}>Ảnh ({this.props.numbers}) <i className="fa fa-sort-asc" aria-hidden="false"></i></Button></li>
          <li className={this.props.stateChildShow === MY_INFO ? s.active : ''}><Button onClick={this.buttonClicked(MY_INFO)} bsClass={s.button}>Thông tin <i className="fa fa-sort-asc"></i></Button></li>
        </ul>
      );
    }
}

  export default withStyles(s)(Tab);
