import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Pagination as BsPagination } from 'react-bootstrap';

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

  onChange(page, event) {
    event.preventDefault();
    this.props.onChange(page);
  }

  render() {
    const { className, display, total, page, next, prev, first, last, ellipsis, boundaryLinks, limit } = this.props;
    const items = Math.ceil(total / limit);
    const maxButtons = Math.min(display, items);
    if (maxButtons <= 1) {
      return null;
    }
    return (<BsPagination
      className={className}
      boundaryLinks={boundaryLinks}
      maxButtons={maxButtons}
      prev={prev}
      next={next}
      first={first}
      last={last}
      ellipsis={ellipsis}
      items={items}
      activePage={page}
      onSelect={this.onChange}
    />);
  }
}

Pagination.propTypes = {
  onChange: PropTypes.func.isRequired,
  total: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  display: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  className: PropTypes.string,
  boundaryLinks: PropTypes.bool,
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
  ellipsis: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.node,
  ]).isRequired,
};

Pagination.defaultProps = {
  display: 5,
  onChange: () => undefined,
  className: 'pull-right',
  prev: true,
  next: true,
  first: true,
  last: true,
  ellipsis: true,
  boundaryLinks: true,
};

