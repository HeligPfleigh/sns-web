import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { compose } from 'react-apollo';
import isUndefined from 'lodash/isUndefined';
import isNull from 'lodash/isNull';
import classNames from 'classnames';

import { Panel, ButtonToolbar, Button, Clearfix } from 'react-bootstrap';
import { DraftToHTML } from '../../../components/Editor';
import s from './FAQ.scss';

class FAQItem extends Component {
  constructor(...args) {
    super(...args);

    this.onDownload = this.onDownload.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onShow = this.onShow.bind(this);
  }

  onUpdate(event) {
    event.preventDefault();
    this.props.onUpdate(this.props.data);
  }

  onDelete(event) {
    event.preventDefault();
    this.props.onDelete(this.props.data);
  }

  onShow(_id) {
    return (event) => {
      event.preventDefault();
      this.props.onShow(_id);
    };
  }

  onDownload(url) {
    const downloadId = `download-${Math.random()}`;
    let timeoutId;
    return (event) => {
      event.preventDefault();

      if (isUndefined(url) || isNull(url)) {
        this.props.onError('Tập tin này bị lỗi.');
        return;
      }

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      const downloadWindow = window.open('about:blank', downloadId, [
        'toolbar=yes',
        'scrollbars=yes',
        'location=yes',
        'menubar=yes',
        'resizable=yes',
        'fullscreen=yes',
        'status=yes',
        `width=${window.outerWidth}`,
        `height=${window.outerHeight}`,
        'left=0',
        'top=0',
      ].join(','));

      timeoutId = setTimeout(() => {
        downloadWindow.location.replace(url);
      }, 300);
    };
  }

  render() {
    const { data, canDelete, canUpdate, show } = this.props;
    return (<Panel header={<div onClick={this.onShow(data._id)}><i className="fa fa-caret-right" aria-hidden="true"></i> {data.name} </div>} eventKey={data._id} key={data._id} className={classNames({ hidePanelBody: !(show === data._id) })}>
      <div className={classNames({ hide: !(show === data._id) })} >
        <div dangerouslySetInnerHTML={{ __html: DraftToHTML(data.message) }} />
        {(canUpdate || canDelete) && (<ButtonToolbar className="pull-right">
          <Button bsStyle="primary" onClick={this.onUpdate} bsSize="xsmall" type="button"><i className="fa fa-edit" aria-hidden="true"></i> Sửa</Button>
          <Button bsStyle="danger" onClick={this.onDelete} bsSize="xsmall" type="button"><i className="fa fa-trash" aria-hidden="true"></i> Xóa</Button>
        </ButtonToolbar>)}
      </div>
      <Clearfix />
    </Panel>);
  }
}

FAQItem.propTypes = {
  data: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    message: PropTypes.string,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  canUpdate: PropTypes.bool.isRequired,
  canDelete: PropTypes.bool.isRequired,
  onError: PropTypes.func.isRequired,
  onShow: PropTypes.func.isRequired,
  show: PropTypes.string.isRequired,
};

FAQItem.defaultProps = {
  canDelete: false,
  canUpdate: false,
  show: '',
};

export default compose(
  withStyles(s),
)(FAQItem);
