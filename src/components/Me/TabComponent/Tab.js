import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Tab.scss';
import Link from '../../Link';
import { MY_TIME_LINE, MY_INFO, MY_FRIEND } from '../../../constants';

class Tab extends Component {
  static propTypes = {
    stateChildShow: PropTypes.string.isRequired,
    isMe: PropTypes.bool.isRequired,
    id: PropTypes.string,
  };

  render() {
    const { isMe, id } = this.props;

    return (
      <ul className={s.tab}>
        <li className={this.props.stateChildShow === MY_TIME_LINE ? s.active : ''}>
          <Link to={isMe ? '/me' : `/user/${id}`} className={s.button}>
            DÒNG THỜI GIAN
            <i className="fa fa-sort-asc"></i>
          </Link>
        </li>
        <li className={this.props.stateChildShow === MY_FRIEND ? s.active : ''}>
          <Link to={isMe ? `/me?tab=${MY_FRIEND}` : `/user/${id}?tab=${MY_FRIEND}`} className={s.button}>
            BẠN BÈ <i className="fa fa-sort-asc"></i>
          </Link>
        </li>
        <li className={this.props.stateChildShow === MY_INFO ? s.active : ''}>
          <Link to={isMe ? `/me?tab=${MY_INFO}` : `/user/${id}?tab=${MY_INFO}`} className={s.button}>
            THÔNG TIN <i className="fa fa-sort-asc"></i>
          </Link>
        </li>
      </ul>
    );
  }
}

export default withStyles(s)(Tab);
