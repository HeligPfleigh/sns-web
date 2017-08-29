import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import MediaQuery from 'react-responsive';
import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import moment from 'moment';
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

import Menu from '../../Menu/Menu';
import FeeList from './FeeList';
import Loading from '../../../../components/Loading';
import s from './styles.scss';
import feesReportPageQuery from './queries/feesReportPageQuery.graphql';

class ReportPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      feeType: {},
      viewMode: 'months',
      isOpen: false,
      dateValue: moment(),
    };
  }

  // filter
  changeFeeType = (val) => {
    if (val && !isEqual(val, this.state.feeType)) {
      this.setState({ feeType: val });
    } else if (!val) {
      const { buildingId } = this.props;
      this.setState({ feeType: {} });
      this.props.loadMoreRows({ buildingId });
    }
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

  handleFilter = () => {
    const { feeType, dateValue } = this.state;

    const month = dateValue.toDate().getMonth() + 1;
    const year = dateValue.toDate().getFullYear();
    const feeDate = `${month}-${year}`;

    const options = {
      feeDate,
    };

    if (!isEmpty(feeType)) {
      options.feeType = feeType.code;
    }

    const { buildingId } = this.props;
    this.props.loadMoreRows({ buildingId, ...options });
  }

  render() {
    const {
      loading,
      feeType,
      dateValue,
      isOpen,
    } = this.state;
    const { buildingId, user, feeTypes, feesReport } = this.props;

    let dataTable = [];
    let isTreeMode = true;
    if (!isEmpty(feesReport)) {
      dataTable = feesReport.edges || [];
      if (!isEmpty(dataTable)) {
        isTreeMode = !isEmpty(dataTable[0].detail);
      }
    }

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
                  <Button bsStyle="primary" onClick={this.handleFilter} >Xem</Button>
                </Col>
                <Clearfix />
              </Col>
              <Col md={12}>
                <FeeList treeMode={isTreeMode} dataSource={dataTable} />
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
  feesReport: PropTypes.object,
  loadMoreRows: PropTypes.func,
  user: PropTypes.object.isRequired,
  buildingId: PropTypes.string.isRequired,
};

export default compose(
  withStyles(s),
  connect(state => ({
    user: state.user,
  })),
  graphql(feesReportPageQuery, {
    options: props => ({
      variables: {
        buildingId: props.buildingId,
      },
      fetchPolicy: 'network-only',
    }),
    props: ({ data }) => {
      const {
        fetchMore,
        feesReport,
        getFeeTypes: feeTypes,
      } = data;

      const loadMoreRows = (variables) => {
        fetchMore({
          variables,
          fetchPolicy: 'network-only',
          updateQuery: (_, { fetchMoreResult }) => fetchMoreResult,
        });
      };
      return {
        feeTypes,
        feesReport,
        loadMoreRows,
      };
    },
  }),
)(ReportPage);
