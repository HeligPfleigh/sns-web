import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Table from 'rc-table';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './styles.scss';

const colsTable = [{
  title: 'Tên chủ hộ',
  dataIndex: 'apartment.owner.profile.fullName',
  key: 'apartment.owner.profile.fullName',
  width: '25%',
}, {
  title: 'Căn hộ', dataIndex: 'apartment.name', key: 'apartment.name', width: '15%',
}, {
  title: 'Tổng tiền', dataIndex: 'totals', key: 'totals', width: '25%',
}, {
  title: 'Tình trạng', dataIndex: 'status', key: 'status', width: '15%',
}, {
  title: 'Hành động', dataIndex: '', key: 'x', render: this.renderAction,
}];

const colsSubTable = [{
  title: 'Loại phí', dataIndex: 'type.name', key: 'type.name', width: '30.5%',
}, {
  title: 'Thành tiền', dataIndex: 'total', key: 'total', width: '23.5%',
}, {
  title: 'Trạng thái', dataIndex: 'status', key: 'status', width: '20%',
}];

const colsTableFilter = [{
  title: 'Tên chủ hộ',
  dataIndex: 'apartment.owner.profile.fullName',
  key: 'apartment.owner.profile.fullName',
  width: '25%',
}, {
  title: 'Căn hộ', dataIndex: 'apartment.name', key: 'apartment.name', width: '10%',
}, {
  title: 'Loại phí', dataIndex: 'totals', key: 'type.name', width: '25%',
}, {
  title: 'Thành tiền', dataIndex: 'totals', key: 'totals', width: '25%',
}, {
  title: 'Tình trạng', dataIndex: 'status', key: 'status', width: '15%',
}];

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
    <Table rowKey="_id" columns={colsSubTable} data={record.detail} />
  );

  handleClick = (index) => {
    console.log(index);
  }

  renderAction = (o, row, index) => (<a href="#" onClick={() => this.handleClick(index)}>Chi tiết</a>);

  render() {
    const { expandedRowKeys } = this.state;
    const { treeMode, dataSource } = this.props;

    return (
      <span>
        { // Default view
          treeMode && <Table
            rowKey="_id"
            data={dataSource || []}
            expandIconAsCell
            expandRowByClick
            columns={colsTable}
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
            columns={colsTableFilter}
          />
        }
      </span>
    );
  }
}

FeeList.propTypes = {
  treeMode: PropTypes.bool.isRequired,
  dataSource: PropTypes.array.isRequired,
};

export default withStyles(s)(FeeList);
