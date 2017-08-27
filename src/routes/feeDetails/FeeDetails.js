import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col, FormControl } from 'react-bootstrap';
import { Field, reduxForm } from 'redux-form';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './FeeDetails.scss';

const renderField = ({ input, label, type, meta: { touched, error, warning } }) => (
  <div>
    <FormControl
      {...input}
      placeholder={label}
      type={type}
    />
    {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
  </div>
);

renderField.propTypes = {
  label: PropTypes.string,
  input: PropTypes.any,
  type: PropTypes.string,
  meta: PropTypes.object,
};

class FeeDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFeeUpdate: false,
      isStatusUpdate: false,
    };
  }

  openFeeUpdate = () => {
    this.setState({
      isFeeUpdate: true,
    });
  }

  openStatusUpdate = () => {
    this.setState({
      isStatusUpdate: true,
    });
  }

  closeFeeUpdate = () => {
    this.setState({
      isFeeUpdate: false,
    });
  }

  closeStatusUpdate = () => {
    this.setState({
      isStatusUpdate: false,
    });
  }

  render() {
    const { isFeeUpdate, isStatusUpdate } = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <Grid>
          <Row className={s.containerTop30}>
            <Col md={3}></Col>
            <Col md={9} sm={12} xs={12} className={s.fee}>
              <div className={s.header}>
                <i className="fa fa-money" aria-hidden="true"></i>
                <span className={s.mainPage}>Quản lý chi phí/ </span>
                <span>Báo cáo/ </span>
                <span>Phòng 203</span>
              </div>
              <div>
                <ul>
                  <li>
                    <div className={s.pullLeft}>
                      <label htmlFor="apartment">Số phòng</label>
                    </div>
                    <div className={s.pullRight}>
                      <span>203</span>
                    </div>
                  </li>
                  <li>
                    <div className={s.pullLeft}>
                      <label htmlFor="startDate">Ngày bắt đầu</label>
                    </div>
                    <div className={s.pullRight}>
                      <span>1/08/2017</span>
                      <i className="fa fa-calendar" aria-hidden="true"></i>
                    </div>
                  </li>
                  <li>
                    <div className={s.pullLeft}>
                      <label htmlFor="endDate">Ngày kết thúc</label>
                    </div>
                    <div className={s.pullRight}>
                      <span>1/09/2017</span>
                      <i className="fa fa-calendar" aria-hidden="true"></i>
                    </div>
                  </li>
                  <li>
                    <div className={s.pullLeft}>
                      <label htmlFor="feeType">Loại phí</label>
                    </div>
                    <div className={s.pullRight}>
                      <span>Nước sinh hoạt</span>
                    </div>
                  </li>
                  <li>
                    <div className={s.pullLeft}>
                      <label htmlFor="total">Tổng số</label>
                    </div>
                    <div className={s.pullRight}>
                      <span>50 khối</span>
                    </div>
                  </li>
                  <li>
                    <div className={s.pullLeft}>
                      <label htmlFor="fee">Tổng số tiền</label>
                    </div>
                    <div className={s.pullRight}>
                      <span>
                        { isFeeUpdate ? <Field
                          name="fee"
                          type="text"
                          component={renderField}
                          label="Enter Text"
                        /> : '300000 VND' }
                      </span>
                      { isFeeUpdate &&
                        <div style={{ display: 'inline-block' }}>
                          <button className={s.saveUpdate} onClick={this.closeFeeUpdate}> Thay đổi </button>
                          <button className={s.cancelUpdate} onClick={this.closeFeeUpdate}> Hủy </button>
                        </div>
                      }
                      { !isFeeUpdate &&
                        <span className={s.edit} onClick={this.openFeeUpdate}>Edit</span>
                      }
                    </div>
                  </li>
                  <li>
                    <div className={s.pullLeft}>
                      <label htmlFor="status">Trạng thái</label>
                    </div>
                    <div className={s.pullRight}>
                      <span>
                        { isStatusUpdate &&
                        <Field
                          name="status"
                          component="select"
                          style={{
                            width: '100%',
                            height: '34px',
                            padding: '6px 12px',
                            backgroundColor: '#fff',
                            backgroundImage: 'none',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                          }}
                        >
                          <option value="paid">Đã thanh toán</option>
                          <option value="unpaid">Chưa thanh toán</option>
                        </Field>}
                        { !isStatusUpdate && 'Đã thanh toán' }
                      </span>
                      { isStatusUpdate &&
                        <div style={{ display: 'inline-block' }}>
                          <button className={s.saveUpdate} onClick={this.closeStatusUpdate}> Thay đổi </button>
                          <button className={s.cancelUpdate} onClick={this.closeStatusUpdate}> Hủy </button>
                        </div>
                      }
                      { !isStatusUpdate &&
                        <span className={s.edit} onClick={this.openStatusUpdate}>Edit</span>
                      }
                    </div>
                  </li>
                </ul>
              </div>
              <div>
                <button
                  className={s.buttonAccept}
                >
                  Xác nhận
                </button>
                <button
                  className={s.buttonCancel}
                >
                  Hủy
                </button>
              </div>
            </Col>
          </Row>
        </Grid>
      </form>
    );
  }
}

FeeDetails.propTypes = {
};

const FeeDetailsForm = reduxForm({
  // a unique name for the form
  form: 'updateFeeDetailsForm',
})(FeeDetails);

export default withStyles(s)(FeeDetailsForm);
