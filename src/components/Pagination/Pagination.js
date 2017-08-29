import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import isNumber from 'lodash/isNumber';

const preventDefault = e => e.preventDefault();

export default class Pagination extends Component {
  constructor(...args) {
    super(...args);

    this.onChange = this.onChange.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    const props = this.props;
    return (
      props.total !== nextProps.total ||
      props.page !== nextProps.page ||
      props.display !== nextProps.display
    );
  }

  onChange(page) {
    return (event) => {
      event.preventDefault();
      this.props.onChange(page);
    };
  }

  render() {
    const { limit, total, display, page, prev, next, first, last } = this.props;
    if (
      ([total, display, page, limit].filter(n => isNumber(n)).length === 0)
      || (limit * page > total)
      || (total === 0)
    ) {
      return null;
    }

    const diff = Math.floor(display / 2);
    let start = Math.max(page - diff, 0);
    const end = total > limit ? Math.min(Math.floor(total / limit), total) : start;

    if (start === end) {
      return null;
    }

    if (total >= display && end >= total) {
      start = total - display;
    }

    let buttons = [];
    for (let i = start; i < end; i++) {
      const isCurrent = page === i;
      // If the button is for the current page then disable the event.
      const btnEvent = isCurrent ? preventDefault : this.onChange(i);
      buttons.push(
        <li key={i} className={classNames({ active: isCurrent })}>
          <a role="button" href="#" onClick={btnEvent} tabIndex="0">
            <span>{i + 1}</span>
            {isCurrent ? <span className="sr-only">(current)</span> : null}
          </a>
        </li>,
      );
    }

    // First and Prev button handlers and class.
    const isNotFirst = page > 0;
    const firstHandler = isNotFirst ? this.onChange(0) : preventDefault;
    const prevHandler = isNotFirst ? this.onChange(page - 1) : preventDefault;

    // Next and Last button handlers and class.
    const isNotLast = page < total - 1;
    const nextHandler = isNotLast ? this.onChange(page + 1) : preventDefault;
    const lastHandler = isNotLast ? this.onChange(total - 1) : preventDefault;

    buttons = [
      <li key="first" className={classNames({ disabled: !isNotFirst })}>
        <a
          role="button"
          href="#"
          tabIndex="0"
          onClick={firstHandler}
          aria-disabled={!isNotFirst}
          aria-label="First"
        >{first}</a>
      </li>,
      <li key="prev" className={classNames({ disabled: !isNotFirst })}>
        <a
          role="button"
          href="#"
          tabIndex="0"
          onClick={prevHandler}
          aria-disabled={!isNotFirst}
          aria-label="Previous"
        >{prev}</a>
      </li>,
    ].concat(buttons);

    buttons = buttons.concat([
      <li key="next" className={classNames({ disabled: !isNotLast })}>
        <a
          role="button"
          href="#"
          tabIndex="0"
          onClick={nextHandler}
          aria-disabled={!isNotLast}
          aria-label="Next"
        >{next}</a>
      </li>,
      <li key="last" className={classNames({ disabled: !isNotLast })}>
        <a
          role="button"
          href="#"
          tabIndex="0"
          onClick={lastHandler}
          aria-disabled={!isNotLast}
          aria-label="Last"
        >{last}</a>
      </li>,
    ]);

    return (
      <ul className={classNames('pagination', this.props.className)} aria-label="Pagination">
        {buttons}
      </ul>
    );
  }
}

Pagination.propTypes = {
  onChange: PropTypes.func.isRequired,
  total: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  display: PropTypes.number.isRequired,
  className: PropTypes.string,
  prev: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.node,
  ]).isRequired,
  next: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.node,
  ]).isRequired,
  first: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.node,
  ]).isRequired,
  last: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.node,
  ]).isRequired,
};

Pagination.defaultProps = {
  display: 5,
  onChange: () => undefined,
  className: 'pagination',
  prev: <span className="fa fa-angle-left" aria-hidden="true" />,
  next: <span className="fa fa-angle-right" aria-hidden="true" />,
  first: <span className="fa fa-angle-double-left" aria-hidden="true" />,
  last: <span className="fa fa-angle-double-right" aria-hidden="true" />,
};

