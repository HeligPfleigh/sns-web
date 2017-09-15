import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Table from 'rc-table';
import includes from 'lodash/includes';
import { Pagination, Clearfix } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { compose } from 'react-apollo';
import classNames from 'classnames';

import reminderToPayFeeMutation from '../graphql/ReminderToPayFeeMutation';

import history from '../../../../core/history';
import { PAID } from '../../../../constants';
import { convertStatus } from '../../../../utils/fee.util';
import s from './styles.scss';

class FeeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedRowKeys: [],
      reminders: [],
    };

    this.reminderToPayFee = this.reminderToPayFee.bind(this);
    this.onReminderToPayFee = this.onReminderToPayFee.bind(this);
  }

  onReminderToPayFee(data, isDisabled) {
    return (event) => {
      event.preventDefault();
      if (isDisabled) {
        return;
      }

      this.props.reminderToPayFeeMutation({
        _id: data._id,
        building: data.building.id,
        apartment: data.apartment.id,
      }).then(() => {
        const { reminders } = this.state;
        reminders.push(data._id);
        this.setState({ reminders });
      });
    };
  }

  // table functional
  onExpandedRowsChange = (rows) => {
    this.setState({
      expandedRowKeys: rows,
    });
  }

  expandedRowRender = record => (
    <Table
      rowKey="_id"
      showHeader={false}
      columns={this.configCols(true)}
      data={record.detail}
    />
  );

  handleClick = (data) => {
    history.push(`/management/fee_detail/${data._id}`);
  }

  handlePageSelect = (pageNum) => {
    this.props.changePage(pageNum);
  }

  configCols = (isSubTable, isFinded) => {
    if (isSubTable) {
      return [{
        title: 'Số phòng', dataIndex: '', key: 'a', width: '20.1%', render: this.reminderToPayFee,
      }, {
        title: 'Loại phí', dataIndex: 'type.name', key: 'type.name', width: '21.7%',
      }, {
        title: 'Thành tiền', dataIndex: 'total', key: 'total', width: '26.7%',
      }, {
        title: 'Trạng thái', dataIndex: 'status', key: 'status', render: this.statusColumn, width: '15.7%',
      }, {
        title: '', dataIndex: '', key: 'x', render: this.viewFeeDetail,
      }];
    }

    const typeName = isFinded ? 'type.name' : '';
    const emptyCol = [{ title: '', dataIndex: '', key: 'tt', width: '4%', render: this.reminderToPayFee }];

    const cols = [{
      title: 'Số phòng', dataIndex: 'apartment.name', key: 'apartment.name', width: '20%',
    }, {
      title: 'Loại phí', dataIndex: typeName, key: typeName, width: '20%',
    }, {
      title: 'Thành tiền', dataIndex: 'totals', key: 'totals', width: '25%',
    }, {
      title: 'Trạng thái', dataIndex: 'status', key: 'status', render: this.statusColumn, width: '15%',
    }, {
      title: '', dataIndex: '', key: 'x', render: isFinded ? this.viewFeeDetail : this.renderAction,
    }];

    return isFinded ? [...emptyCol, ...cols] : cols;
  }

  // Functional generator status column
  statusColumn = (data, row) => convertStatus(row.status);

  viewFeeDetail = data => (
    <a
      href="#"
      onClick={(evt) => {
        evt.preventDefault();
        this.handleClick(data);
      }}
    >{'Chi tiết >>'}</a>
  );

  reminderToPayFee(data) {
    if (data && data.status === PAID) {
      return null;
    }
    let isDisabled = this.state.reminders.includes(data._id);

    if (!isDisabled && data.lastRemind) {
      isDisabled = ((new Date().getTime() - new Date(data.lastRemind).getTime()) / 86400000) < 3;
    }
    return (<button
      className={s.btnRemind}
      disabled={isDisabled}
      onClick={this.onReminderToPayFee(data, isDisabled)}
    ><i title="Nhắc nhở việc đóng phí" aria-hidden="true" className={classNames('fa fa-bell', { disabledReminderToPayFee: isDisabled })}></i>
    </button>);
  }

  doNothing = (evt) => {
    evt.preventDefault();
  }

  renderAction = (data) => {
    if (includes(this.state.expandedRowKeys, data._id)) {
      return (
        <a href="#" onClick={this.doNothing}>
          Xem thêm
          <i
            aria-hidden="true"
            className="fa fa-caret-down"
            style={{ marginLeft: '3px' }}
          ></i>
        </a>
      );
    }
    return (
      <a href="#" onClick={this.doNothing} >
        Xem thêm
        <i
          aria-hidden="true"
          className="fa fa-caret-right"
          style={{ marginLeft: '3px' }}
        ></i>
      </a>
    );
  }

  render() {
    const { expandedRowKeys } = this.state;
    const { treeMode, pagination, dataSource } = this.props;

    return (
      <span>
        { // Default view
          treeMode && <Table
            rowKey="_id"
            data={dataSource || []}
            expandIconAsCell
            expandRowByClick
            columns={this.configCols(false)}
            emptyText="Không có thông tin hiển thị"
            expandedRowKeys={expandedRowKeys}
            expandedRowRender={this.expandedRowRender}
            onExpandedRowsChange={this.onExpandedRowsChange}
          />
        }
        { // Filter view
          !treeMode && <Table
            rowKey="_id"
            emptyText="Dữ liệu tìm kiếm không tồn tại"
            data={dataSource || []}
            columns={this.configCols(false, true)}
          />
        }
        { (pagination.totalPage > 1) &&
          <div className="pull-right">
            <Pagination
              maxButtons={5}
              prev={pagination.totalPage > 5}
              next={pagination.totalPage > 5}
              first={pagination.totalPage > 5}
              last={pagination.totalPage > 5}
              ellipsis={pagination.totalPage > 5}
              items={pagination.totalPage}
              activePage={pagination.currentPage}
              onSelect={this.handlePageSelect}
            />
          </div>
        }
        <Clearfix />
      </span>
    );
  }
}

FeeList.propTypes = {
  treeMode: PropTypes.bool.isRequired,
  pagination: PropTypes.object.isRequired,
  changePage: PropTypes.func.isRequired,
  dataSource: PropTypes.array.isRequired,
  reminderToPayFeeMutation: PropTypes.func.isRequired,
};

export default compose(
  withStyles(s),
  reminderToPayFeeMutation,
)(FeeList);
