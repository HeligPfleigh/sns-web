import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Image } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './styles.scss';

class Banner extends Component {
  static propTypes = {
    isNew: PropTypes.bool,
  }

  doNothing = (evt) => {
    if (evt) evt.preventDefault();
  }

  render() {
    return (
      <div className={classNames(s.banner)}>
        <Image src="/images/banner.png" className={classNames(s.img)} />
        <div className={classNames(s.boxText)}>
          <h2> Khai trương bể bơi</h2>
          <h2>hè 2017</h2>
          <a href="#" className={classNames(s.link)} onClick={this.doNothing}>
            ĐĂNG KÝ NGAY
          </a>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Banner);
