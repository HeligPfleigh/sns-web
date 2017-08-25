import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Grid, Row, Col, FormControl } from 'react-bootstrap';
import { Field, reduxForm } from 'redux-form';
import feeDetailsQuery from './feeDetailsQuery.graphql';
import Loading from '../../components/Loading';
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

function formatDate(datetring) {
  const date = new Date(datetring);
  let day = date.getDate();
  let month = date.getMonth();
  const year = date.getFullYear();

  if (day < 10) {
    day = `0${day}`;
  }
  if (month < 10) {
    month = `0${month + 1}`;
  }

  return `${day}/${month}/${year}`;
}

class FeeDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isTotalUpdate: false,
      isStatusUpdate: false,
    };
  }

  openFeeUpdate = () => {
    this.setState({
      isTotalUpdate: true,
    });
  }

  openStatusUpdate = () => {
    this.setState({
      isStatusUpdate: true,
    });
  }

  closeTotalUpdate = () => {
    this.setState({
      isTotalUpdate: false,
    });
  }

  closeStatusUpdate = () => {
    this.setState({
      isStatusUpdate: false,
    });
  }

  render() {
    const {
      data: {
        loading,
        fee,
      },
    } = this.props;
    if (loading) {
      return <Loading show={loading} full>Đang tải ...</Loading>;
    }
    const { isTotalUpdate, isStatusUpdate } = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <Grid>
          <Row className={s.containerTop30}>
            <Col md={3}>
              { !fee && <h3>Not found page</h3> }
            </Col>
            { !loading && fee &&
              <Col md={9} sm={12} xs={12} className={s.fee}>
                <div className={s.header}>
                  <i className="fa fa-money" aria-hidden="true"></i>
                  <span className={s.mainPage}>Quản lý chi phí/ </span>
                  <span>Báo cáo/ </span>
                  <span>Phòng { fee.apartment && fee.apartment.number }</span>
                </div>
                <div>
                  <ul>
                    <li>
                      <div className={s.pullLeft}>
                        <label htmlFor="apartment">Số phòng</label>
                      </div>
                      <div className={s.pullRight}>
                        <span>{ fee.apartment && fee.apartment.number }</span>
                      </div>
                    </li>
                    <li>
                      <div className={s.pullLeft}>
                        <label htmlFor="startDate">Ngày bắt đầu</label>
                      </div>
                      <div className={s.pullRight}>
                        <span>{ formatDate(fee.from) }</span>
                        <i className="fa fa-calendar" aria-hidden="true"></i>
                      </div>
                    </li>
                    <li>
                      <div className={s.pullLeft}>
                        <label htmlFor="endDate">Ngày kết thúc</label>
                      </div>
                      <div className={s.pullRight}>
                        <span>{ formatDate(fee.to) }</span>
                        <i className="fa fa-calendar" aria-hidden="true"></i>
                      </div>
                    </li>
                    <li>
                      <div className={s.pullLeft}>
                        <label htmlFor="feeType">Loại phí</label>
                      </div>
                      <div className={s.pullRight}>
                        <span>{ fee.type && fee.type.name }</span>
                      </div>
                    </li>
                    <li>
                      <div className={s.pullLeft}>
                        <label htmlFor="">Tổng số</label>
                      </div>
                      <div className={s.pullRight}>
                        <span>50 khối</span>
                      </div>
                    </li>
                    <li>
                      <div className={s.pullLeft}>
                        <label htmlFor="total">Tổng số tiền</label>
                      </div>
                      <div className={s.pullRight}>
                        <span>
                          { isTotalUpdate ? <Field
                            name="total"
                            type="text"
                            component={renderField}
                            label="Enter Text"
                          /> : fee.total }
                        </span>
                        VND
                        { isTotalUpdate &&
                          <div style={{ display: 'inline-block', marginLeft: '5px' }}>
                            <button className={s.saveUpdate} onClick={this.closeTotalUpdate}> Thay đổi </button>
                            <button className={s.cancelUpdate} onClick={this.closeTotalUpdate}> Hủy </button>
                          </div>
                        }
                        { !isTotalUpdate &&
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
                          { !isStatusUpdate && (fee.status === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán') }
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
              </Col>
            }
          </Row>
        </Grid>
      </form>
    );
  }
}

FeeDetails.propTypes = {
  data: PropTypes.shape({}).isRequired,
};

const FeeDetailsForm = reduxForm({
  // a unique name for the form
  form: 'updateFeeDetailsForm',
})(FeeDetails);

export default compose(
  withStyles(s),
  graphql(feeDetailsQuery, {
    options: props => ({
      variables: {
        feeId: props.feeId,
      },
    }),
  }),
)(FeeDetailsForm);
