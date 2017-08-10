import React, { Component } from 'react';
import PropTypes from 'prop-types';
import timeagojs from 'timeago.js';
import * as _ from 'lodash';

import locales from './locale';

if (_.isArray(locales)) {
  locales.forEach((locale) => {
    timeagojs.register(locale, require(`./locales/${locale}`).default);
  });
}

export default class TimeAgo extends Component {
  constructor(...args) {
    super(...args);
    this.timeagoInstance = null;
  }
  // init instance
  componentWillMount() {
    if (this.timeagoInstance === null) {
      this.timeagoInstance = timeagojs();
    }
  }
  // first add
  componentDidMount() {
    this.renderTimeAgo();
  }
  // update
  componentDidUpdate() {
    this.renderTimeAgo();
  }
  // remove
  componentWillUnmount() {
    timeagojs.cancel(this.timeagoDom);
    this.timeagoInstance = null;
  }
  // init
  renderTimeAgo() {
    const { datetime, locale } = this.props;
    // cancel all the interval
    timeagojs.cancel(this.timeagoDom);
    // if is live
    if (this.live !== false) {
      // live render
      if (datetime instanceof Date) {
        this.timeagoDom.setAttribute('datetime', datetime.getTime());
      } else {
        this.timeagoDom.setAttribute('datetime', datetime);
      }
      this.timeagoInstance.render(this.timeagoDom, locale);
    }
  }
  // for render
  render() {
    const { datetime, live, locale, className, style, ...others } = this.props;
    return (
      <time
        ref={(c) => { this.timeagoDom = c; }}
        className={className || ''}
        style={style}
        {...others}
      >
        {this.timeagoInstance.format(datetime, locale)}
      </time>
    );
  }
}

TimeAgo.propTypes = {
  datetime: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
    PropTypes.number,
  ]).isRequired,  // date to be formated
  live: PropTypes.bool,        // real time render.
  locale: PropTypes.string,    // locale lang
  className: PropTypes.string, // class name
  style: PropTypes.object,      // style object
};

TimeAgo.defaultProps = {
  live: true,
  locale: 'en',
};
