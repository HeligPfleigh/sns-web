import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import MediaQuery from 'react-responsive';
import Table from 'rc-table';
import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import DateTime from 'react-datetime';
import Select from 'react-select';
import {
  Grid,
  Row,
  Col,
  Button,
  Clearfix,
  ControlLabel,
} from 'react-bootstrap';

import Loading from '../../../../components/Loading';
import Menu from '../../Menu/Menu';
import s from './styles.scss';

const columns = [{
  title: 'Name', dataIndex: 'name', key: 'name', width: 100,
}, {
  title: 'Age', dataIndex: 'age', key: 'age', width: 100,
}, {
  title: 'Address', dataIndex: 'address', key: 'address', width: 200,
}, {
  title: 'Apeartions', dataIndex: '', key: 'operations', render: () => <a href="#">Delete</a>,
}];

const data = [
  { name: 'Jack', age: 28, address: 'some where', key: '1' },
  { name: 'Rose', age: 36, address: 'some where', key: '2' },
];

const getFeeTypes = gql`query {
  getFeeTypes {
    code
    name
  }
}`;

class ReportPage extends Component {
  state= {
    loading: false,
    feeType: {},
    viewMode: 'months',
    isOpen: false,
    dateValue: new Date(),
  }

  changeFeeType = (val) => {
    this.setState({ feeType: val });
  }

  dateChange = (val) => {
    this.setState({ dateValue: val });
    const { viewMode } = this.state;
    if (viewMode === 'months') {
      this.setState({ isOpen: false });
    }
  }

  dateViewMode = (mode) => {
    this.setState({
      viewMode: mode,
    });
  }

  render() {
    const { loading, feeType, dateValue, isOpen } = this.state;
    const { buildingId, user, feeTypes } = this.props;

    return (
      <Grid>
        <Loading show={loading} full>Đang tải ...</Loading>
        <Row className={s.containerTop30}>
          <MediaQuery minDeviceWidth={992} values={{ deviceWidth: 1600 }}>
            <Col md={3} smHidden xsHidden>
              <Menu
                user={user}
                parentPath={`/management/${buildingId}`}
                pageKey="fee_management>fee_dashboard"
              />
            </Col>
          </MediaQuery>
          <Col md={9} sm={12} xs={12}>
            <Row className={s.container}>
              <Col md={12}>
                <ol className={classNames('breadcrumb')}>
                  <li>
                    <a href="#">
                      <i className="fa fa-money" aria-hidden="true"></i>
                      &nbsp;
                      Quản lý chi phí
                    </a>
                  </li>
                  <li className="active">Báo cáo</li>
                </ol>
              </Col>
              <Col md={12} className={s['panel-filter']}>
                <Col sm={2} xsHidden className={s['label-filter']}>
                  <ControlLabel htmlFor="cmbFeeTypes">Chọn mục</ControlLabel>
                </Col>
                <Col sm={3} className={s['item-filter']}>
                  <Select
                    name="cmbFeeTypes"
                    valueKey="code"
                    labelKey="name"
                    options={feeTypes || []}
                    onChange={this.changeFeeType}
                    clearable={!isEmpty(feeType)}
                    value={!isEmpty(feeType) ? feeType : undefined}
                    placeholder="Chọn chi phí"
                    noResultsText="Loại chi phí không tồn tại"
                    clearValueText="Xóa mục đã chọn"
                  />
                </Col>
                <Col sm={3} className={s['item-filter']}>
                  <DateTime
                    locale="vi"
                    inputProps={{
                      readOnly: true,
                    }}
                    viewMode="months"
                    dateFormat="MM-YYYY"
                    open={isOpen}
                    timeFormat={false}
                    defaultValue={dateValue}
                    value={dateValue}
                    onChange={this.dateChange}
                    onViewModeChange={this.dateViewMode}
                  />
                </Col>
                <Col sm={1} className={s['item-filter']} >
                  <Button bsStyle="primary" onClick={() => console.log('DKM')} >Xem</Button>
                </Col>
                <Clearfix />
              </Col>
              <Col md={12}>
                <Table columns={columns} data={data} />
              </Col>
            </Row>
          </Col>
        </Row>
      </Grid>
    );
  }
}

ReportPage.propTypes = {
  feeTypes: PropTypes.array,
  user: PropTypes.object.isRequired,
  buildingId: PropTypes.string.isRequired,
};

export default compose(
  withStyles(s),
  connect(state => ({
    user: state.user,
  })),
  graphql(getFeeTypes, {
    options: () => ({
      fetchPolicy: 'network-only',
    }),
    props: ({ data: result }) => ({
      feeTypes: result.getFeeTypes,
    }),
  }),
)(ReportPage);
