import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Grid, Row, Col, FormControl } from 'react-bootstrap';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import moment from 'moment';
import { loadFee } from '../../reducers/fees';
import feeDetailsQuery from './feeDetailsQuery.graphql';
import updateFeeDetailMutation from './updateFeeDetailMutation.graphql';
import Loading from '../../components/Loading';
import Menu from '../BuildingManagement/Menu/Menu';
import { PAID, UNPAID } from '../../constants';
import {
  required,
  minLength4,
  maxLength9,
} from '../../utils/validator';
import reminderToPayFeeMutation from './ReminderToPayFeeMutation';
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
      isTotalUpdate: false,
      isStatusUpdate: false,
      submitting: false,
      hasReminded: false,
    };

    this.onReminderToPayFee = this.onReminderToPayFee.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { data: { fee } } = nextProps;
    this.props.load({
      total: fee && fee.total,
      status: fee && fee.status,
    });
  }

  onReminderToPayFee(_id, apartment, building) {
    return (event) => {
      event.preventDefault();
      if (this.state.hasReminded) {
        return;
      }

      this.props.reminderToPayFeeMutation({
        _id,
        apartment,
        building,
      }).then(() => {
        this.setState({ hasReminded: true });
      });
    };
  }

  openFeeUpdate = () => {
    this.setState({
      isTotalUpdate: true,
      isStatusUpdate: false,
    });
  }

  openStatusUpdate = () => {
    this.setState({
      isTotalUpdate: false,
      isStatusUpdate: true,
    });
  }

  closeFeeUpdate = () => {
    this.setState({
      isTotalUpdate: false,
      isStatusUpdate: false,
    });
  }

  submit = (values) => {
    const {
      data: {
        fee: {
          _id,
          building,
          total,
        },
      },
    } = this.props;
    if (values.total.length === 0 && values.total.length < 4) {
      this.props.updateFeeDetail(_id, total, values.status, building);
    } else {
      this.props.updateFeeDetail(_id, values.total, values.status, building);
    }
    this.closeFeeUpdate();
  }

  render() {
    const {
      data: {
        loading,
        fee,
      },
      handleSubmit,
      user,
    } = this.props;
    const { submitting } = this.state;
    if (loading) {
      return <Loading show={loading} full>Đang tải ...</Loading>;
    }
    const { isTotalUpdate, isStatusUpdate } = this.state;
    return (
      <form onSubmit={handleSubmit(this.submit)}>
        <Grid>
          <Row className={s.containerTop30}>
            <MediaQuery minDeviceWidth={992} values={{ deviceWidth: 1600 }}>
              <Col md={3} smHidden xsHidden>
                <Menu
                  user={user}
                  parentPath={`/management/${fee.building.id}`}
                  pageKey="fee_management>fee_dashboard"
                />
              </Col>
            </MediaQuery>
            { !loading && fee &&
              <Col md={9} sm={12} xs={12} className={s.fee}>
                <div className={s.header}>
                  <i className="fa fa-money" aria-hidden="true"></i>
                  <span className={s.mainPage}>Quản lý chi phí / </span>
                  <span>Báo cáo / </span>
                  <span>Phòng { fee.apartment && fee.apartment.name }</span>
                </div>
                <div>
                  <ul>
                    <li>
                      <div className={s.pullLeft}>
                        <label htmlFor="apartment">Số phòng</label>
                      </div>
                      <div className={s.pullRight}>
                        <span>{ fee.apartment && fee.apartment.name }</span>
                      </div>
                    </li>
                    <li>
                      <div className={`${s.pullLeft} ${s.showMobile}`} style={{ minWidth: '300px' }}>
                        <label htmlFor="startDate" style={{ minWidth: '115px' }}>Ngày bắt đầu</label>
                        <span>{moment(fee.from).format('DD/MM/YYYY')}</span>
                        <i className="fa fa-calendar" aria-hidden="true"></i>
                      </div>
                      <div className={s.pullRight}>
                        <label htmlFor="endDate" style={{ minWidth: '115px' }}>Ngày kết thúc</label>
                        <span>{moment(fee.to).format('DD/MM/YYYY')}</span>
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
                    { /* <li>
                      <div className={s.pullLeft}>
                        <label htmlFor="">Tổng số</label>
                      </div>
                      <div className={s.pullRight}>
                        <span>50 khối</span>
                      </div>
                    </li> */ }
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
                            validate={[required, maxLength9, minLength4]}
                          /> : fee.total }
                        </span> VND
                        { isTotalUpdate &&
                          <div style={{ marginTop: '10px' }}>
                            <button type="submit" className={s.saveUpdate} disabled={submitting}> Thay đổi </button>
                            <button className={s.cancelUpdate} onClick={this.closeFeeUpdate}> Hủy </button>
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
                            <option value={PAID}>Đã thanh toán</option>
                            <option value={UNPAID}>Chưa thanh toán</option>
                          </Field>}
                          { !isStatusUpdate && (fee.status === PAID ?
                            (<span style={{ color: '#46b8da', fontWeight: 'bold' }}>Đã thanh toán</span>) :
                            (<span style={{ color: '#FF6347', fontWeight: 'bold' }}>Chưa thanh toán</span>)
                          )}
                        </span>
                        { isStatusUpdate &&
                          <div style={{ marginTop: '10px' }}>
                            <button type="submit" className={s.saveUpdate} disabled={submitting}> Thay đổi </button>
                            <button className={s.cancelUpdate} onClick={this.closeFeeUpdate}> Hủy </button>
                          </div>
                        }
                        { !isStatusUpdate &&
                          <span className={s.edit} onClick={this.openStatusUpdate}>Edit</span>
                        }
                      </div>
                    </li>
                    <li>
                      <div className={s.pullLeft}>&nbsp;</div>
                      <div className={s.pullRight}>
                        {!isStatusUpdate && (fee.status === UNPAID) &&
                          <button
                            disabled={submitting || this.state.hasReminded || (fee.lastRemind && ((new Date().getTime() - new Date(fee.lastRemind).getTime()) / 86400000) < 3)}
                            type="button"
                            onClick={this.onReminderToPayFee(fee._id, fee.apartment.id, fee.building.id)}
                            className="btn btn-warning"
                          >
                            Nhắc nhở đóng phí
                          </button>
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
  data: PropTypes.shape({
    fee: PropTypes.shape({
      total: PropTypes.number,
      status: PropTypes.string,
    }),
  }).isRequired,
  load: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  updateFeeDetail: PropTypes.func.isRequired,
  reminderToPayFeeMutation: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
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
  reminderToPayFeeMutation,
  graphql(updateFeeDetailMutation, {
    props: ({ ownProps, mutate }) => ({
      updateFeeDetail: (_id, total, status, building) => mutate({
        variables: {
          input: {
            feeId: _id,
            total,
            status,
            buildingId: building.id,
          },
        },
        update: (store, { data: { updateFeeDetail } }) => {
        // Read the data from our cache for this query.
          const data = store.readQuery({
            query: feeDetailsQuery,
            variables: {
              feeId: ownProps.feeId,
              cursor: null,
            },
          });
          data.fee.total = updateFeeDetail.fee.total;
          data.fee.status = updateFeeDetail.fee.status;
          // Write our data back to the cache.
          store.writeQuery({
            query: feeDetailsQuery,
            variables: {
              feeId: ownProps.feeId,
              cursor: null,
            },
            data,
          });
        },
      }),
    }),
  }),
  connect(
    state => ({
      initialValues: state.fees.feeDetail,
    }),
    { load: loadFee },
  ),
  connect(state => ({
    user: state.user,
  })),
)(FeeDetailsForm);
