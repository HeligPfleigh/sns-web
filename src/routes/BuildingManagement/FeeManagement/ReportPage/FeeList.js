import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Table from 'rc-table';
import includes from 'lodash/includes';
import { Pagination, Clearfix } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './styles.scss';

class FeeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedRowKeys: [],
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

  handleClick = (index) => {
    console.log(index);
  }

  handlePageSelect = (pageNum) => {
    this.props.changePage(pageNum);
  }

  configCols = (isSubTable) => {
    if (isSubTable) {
      return [{
        title: 'Số phòng', dataIndex: '', key: 'a', width: '20.1%',
      }, {
        title: 'Loại phí', dataIndex: 'type.name', key: 'type.name', width: '21.7%',
      }, {
        title: 'Thành tiền', dataIndex: 'total', key: 'total', width: '26.7%',
      }, {
        title: 'Trạng thái', dataIndex: 'status', key: 'status', width: '15.7%',
      }, {
        title: '', dataIndex: '', key: 'x', render: this.viewFeeDetail,
      }];
    }

    return [{
      title: 'Số phòng', dataIndex: 'apartment.name', key: 'apartment.name', width: '20%',
    }, {
      title: 'Loại phí', dataIndex: '', key: 'a', width: '20%',
    }, {
      title: 'Thành tiền', dataIndex: 'totals', key: 'totals', width: '25%',
    }, {
      title: 'Trạng thái', dataIndex: 'status', key: 'status', width: '15%',
    }, {
      title: '', dataIndex: '', key: 'x', render: this.renderAction,
    }];
  }

  viewFeeDetail = (o, row, index) => (
    <a href="#" onClick={() => this.handleClick(index)}>{'Chi tiết >>'}</a>
  );

  renderAction = (o, row, index) => {
    if (includes(this.state.expandedRowKeys, o._id)) {
      return (<a
        href="#" onClick={(evt) => {
          evt.preventDefault();
          this.handleClick(index);
        }}
      >
        Xem thêm
        <i
          aria-hidden="true"
          className="fa fa-caret-down"
          style={{ marginLeft: '3px' }}
        ></i>
      </a>);
    }
    return (<a
      href="#" onClick={(evt) => {
        evt.preventDefault();
        this.handleClick(index);
      }}
    >
      Xem thêm
      <i
        aria-hidden="true"
        className="fa fa-caret-right"
        style={{ marginLeft: '3px' }}
      ></i>
    </a>);
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
            columns={this.configCols(false)}
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
};

export default withStyles(s)(FeeList);