import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { compose } from 'react-apollo';
import isUndefined from 'lodash/isUndefined';
import isNull from 'lodash/isNull';
import classNames from 'classnames';
import { ListGroupItem, ButtonToolbar, Button, Clearfix } from 'react-bootstrap';

import DownloadFile from '../../../components/Common/DownloadFile';
import s from './Document.scss';

class DocumentItem extends Component {
  constructor(...args) {
    super(...args);

    this.onDownload = this.onDownload.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  onUpdate(event) {
    event.preventDefault();
    this.props.onUpdate(this.props.data);
  }

  onDelete(event) {
    event.preventDefault();
    this.props.onDelete(this.props.data);
  }

  onDownload(url) {
    return (event) => {
      event.preventDefault();

      if (isUndefined(url) || isNull(url)) {
        this.props.onError('Tập tin này bị lỗi.');
        return;
      }

      DownloadFile(url);
    };
  }

  render() {
    const { data, canDelete, canUpdate } = this.props;
    return (<ListGroupItem className={s.documentItem}>
      <div className={s.titleEllipsis} title={data.name}>
        <i className="fa fa-caret-right" aria-hidden="true"></i> {data.name}
      </div>
      <ButtonToolbar className="pull-right">
        <a className={classNames('btn btn-default btn-xs', s.btnDownload)} onClick={this.onDownload(data.file)} title={data.file}>
          (<i className="fa fa-download" aria-hidden="true"></i> Tải xuống)
        </a>
        {canUpdate && (
          <Button bsStyle="primary" onClick={this.onUpdate} bsSize="xsmall">
            <i className="fa fa-edit" aria-hidden="true"></i> Sửa
          </Button>
        )}
        {canDelete && (
          <Button bsStyle="danger" onClick={this.onDelete} bsSize="xsmall">
            <i className="fa fa-trash" aria-hidden="true"></i> Xóa
          </Button>
        )}
      </ButtonToolbar>
      <Clearfix />
    </ListGroupItem>);
  }
}

DocumentItem.propTypes = {
  data: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    file: PropTypes.string,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  canUpdate: PropTypes.bool.isRequired,
  canDelete: PropTypes.bool.isRequired,
  onError: PropTypes.func.isRequired,
};

DocumentItem.defaultProps = {
  canDelete: false,
  canUpdate: false,
};

export default compose(
  withStyles(s),
)(DocumentItem);
