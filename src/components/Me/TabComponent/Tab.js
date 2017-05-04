import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Button } from 'react-bootstrap';
import s from './Tab.scss';
import Link from '../../Link';
import { MY_TIME_LINE, MY_INFO } from '../../../constants';

class Tab extends Component {
  static propTypes = {
    stateChildShow: PropTypes.string.isRequired,
  };

  render() {
    return (
      <ul className={s.tab}>
        <li className={this.props.stateChildShow === MY_TIME_LINE ? s.active : ''}>
          <Link to="/me" className={s.button}>
            Dòng thời gian
            <i className="fa fa-sort-asc"></i>
          </Link>
        </li>
        <li className={this.props.stateChildShow === MY_INFO ? s.active : ''}>
          <Link to={`/me?tab=${MY_INFO}`} className={s.button}>
            Thông tin <i className="fa fa-sort-asc"></i>
          </Link>
        </li>
      </ul>
    );
  }
}

export default withStyles(s)(Tab);