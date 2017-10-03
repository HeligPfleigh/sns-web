import React from 'react';
import PropTypes from 'prop-types';
import { Col, Button, Clearfix, Alert } from 'react-bootstrap';
import { compose } from 'react-apollo';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import DateTime from 'react-datetime';
import Select from 'react-select';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './FeeServices.scss';
import FeeTablePerMonth from './FeeTablePerMonth/FeeTablePerMonth';

class FeeServices extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      feeType: {},
      isOpen: false,
      viewMode: 'months',
      dateValue: undefined,
    };
  }

  // filter
  changeFeeType = (val) => {
    if (val && !isEqual(val, this.state.feeType)) {
      this.setState({ feeType: val });
    } else if (!val) {
      const { apartment, loadMoreRows } = this.props;
      this.setState({
        feeType: {},
        dateValue: undefined,
      });
      loadMoreRows({
        apartmentId: apartment && apartment._id,
      });
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
    this.setState({ viewMode: mode });
  }

  handleFilter = () => {
    const { feeType, dateValue } = this.state;

    const options = {};

    if (dateValue) {
      const month = dateValue.toDate().getMonth() + 1;
      const year = dateValue.toDate().getFullYear();
      const feeDate = `${month}-${year}`;
      options.feeDate = feeDate;
    }

    if (!isEmpty(feeType)) {
      options.feeType = feeType.code;
    }

    if (!isEmpty(options)) {
      const { apartment, loadMoreRows } = this.props;
      loadMoreRows({
        ...options,
        apartmentId: apartment && apartment._id,
      });
    }
  }

  render() {
    const { feeType, dateValue, isOpen } = this.state;
    const { fees, apartment, feeTypes } = this.props;
    return (
      <div className={s.container}>
        <Col className={s.header}>
          <i className={`fa fa-home ${s.homeIcon}`} aria-hidden="true"></i>
          {apartment && <h5>{`Căn hộ: ${apartment.name}`}</h5>}
        </Col>
        <Clearfix />
        <Col sm={12} className={s['panel-filter']}>
          <Col smOffset={2} sm={4} className={s['item-filter']}>
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
                placeholder: 'DD-YYYY',
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
          <Col sm={2} className={s['item-filter']} >
            <Button bsStyle="primary" onClick={this.handleFilter} >Xem</Button>
          </Col>
        </Col>
        <Clearfix />
        <Col>
          { fees && isEmpty(fees) &&
            <Alert bsStyle="warning" style={{ marginBottom: 0 }}>
              Hiện căn hộ của bạn chưa có thông tin phí nào!
            </Alert>
          }
          { fees && !isEmpty(fees) &&
            fees.map(fee => <FeeTablePerMonth
              key={Math.random() * 10000}
              fee={fee}
            />)
          }
        </Col>
        <Clearfix />
      </div>
    );
  }
}

FeeServices.propTypes = {
  fees: PropTypes.array,
  feeTypes: PropTypes.array,
  apartment: PropTypes.object,
  loadMoreRows: PropTypes.func,
};

export default compose(
  withStyles(s),
)(FeeServices);
