import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Grid, Row, Col, ControlLabel, Button, FormGroup, InputGroup, Alert, ButtonToolbar } from 'react-bootstrap';
import MediaQuery from 'react-responsive';
import { reduxForm, Field, formValueSelector } from 'redux-form';

import Loading from '../../../components/Loading';
import * as ReduxFormFields from '../../../components/ReduxForm';
import Validator from '../../../components/Validator';
import BuildingFeeSettingsQuery from './BuildingFeeSettingsQuery.graphql';
import BuildingFeeSettingsMutation from './BuildingFeeSettingsMutation.graphql';
import Menu from '../Menu/Menu';
import s from './FeeSetting.scss';

class FeeSetting extends Component {
  /**
   *
   * @param {*} args
   */
  constructor(...args) {
    super(...args);

    this.state = {
      message: undefined,
    };

    this.formFields = {};
  }

  onResetForm = () => {
    const { dispatch, reset, form } = this.props;
    dispatch(reset(form));
  }

  onSubmitForm = ({
    automatedReminderAfterHowDays,
    timeLimitationBetween2FeeNotifications,
  }) => {
    const { save } = this.props;

    return save({
      automatedReminderAfterHowDays,
      timeLimitationBetween2FeeNotifications,
    })
    .then(() => {
      this.setState({
        message: 'Cập nhật dữ liệu thành công.',
        error: false,
      });
      const { initialize, currentValues } = this.props;
      initialize(currentValues);
    })
    .catch(() => this.setState({
      message: 'Có lỗi xảy ra trong quá trình cập nhật dữ liệu.',
      error: true,
    }));
  }

  /**
   *
   */
  render() {
    const {
      buildingId,
      user,
      handleSubmit,
      pristine,
      submitting,
      invalid,
      form,
      data: {
        loading,
      },
    } = this.props;

     // Show loading
    if (loading) {
      return <Loading show={loading} full>Đang tải ...</Loading>;
    }

    const { message, error } = this.state;

    return (
      <Grid>
        <Row className={s.containerTop30}>
          <MediaQuery minDeviceWidth={992} values={{ deviceWidth: 1600 }}>
            <Col md={3} smHidden xsHidden>
              <Menu pageKey="settings.general>settings.fee" parentPath={`/management/${buildingId}`} user={user} />
            </Col>
          </MediaQuery>
          <Col md={9} sm={12} xs={12} className={s.container}>
            <Col xs={12}>
              <ol className="breadcrumb">
                <li className={s.breadcrumbItem}>
                  <i className="fa fa-cog" aria-hidden="true"></i> Phí - Hóa đơn của tòa nhà
                  </li>
              </ol>
            </Col>
            <Col xs={12}>
              {message && <Alert bsStyle={error ? 'danger' : 'success'}>{message}</Alert>}
              <form className="form-horizontal" name={form} noValidate onSubmit={handleSubmit(this.onSubmitForm)}>

                <FormGroup controlId="automatedReminderAfterHowDays">
                  <ControlLabel className="col-sm-5">Tự động gửi thông báo sau</ControlLabel>
                  <Col sm={7}>
                    <Row>
                      <Col sm={4}>
                        <Field
                          type="number"
                          name="automatedReminderAfterHowDays"
                          component={ReduxFormFields.InputField}
                          validate={[
                            Validator.Required(null, 'Bạn phải nhập dữ liệu'),
                            Validator.Int(null, 'Bạn phải nhập số tự nhiên'),
                            Validator.Min.Num(null, 'Giá trị phải lớn hơn 0', 1),
                          ]}
                          ref={input => this.formFields.automatedReminderAfterHowDays = input}
                          withRef
                        />
                      </Col>
                      <Col sm={8}>
                        <InputGroup.Addon className={s.inputAddon}>ngày quá hạn nộp phí</InputGroup.Addon>
                      </Col>
                    </Row>
                  </Col>
                </FormGroup>

                <FormGroup controlId="timeLimitationBetween2FeeNotifications">
                  <ControlLabel className="col-sm-5">Giới hạn giữa hai lần liên tiếp gửi thông báo phí</ControlLabel>
                  <Col sm={7}>
                    <Row>
                      <Col sm={4}>
                        <Field
                          type="number"
                          name="timeLimitationBetween2FeeNotifications"
                          component={ReduxFormFields.InputField}
                          validate={[
                            Validator.Required(null, 'Bạn phải nhập dữ liệu'),
                            Validator.Int(null, 'Bạn phải nhập số tự nhiên'),
                            Validator.Min.Num(null, 'Giá trị phải lớn hơn 0', 1),
                          ]}
                          ref={input => this.formFields.timeLimitationBetween2FeeNotifications = input}
                          withRef
                        />
                      </Col>
                      <Col sm={8}>
                        <InputGroup.Addon className={s.inputAddon}>ngày</InputGroup.Addon>
                      </Col>
                    </Row>
                  </Col>
                </FormGroup>

                <FormGroup controlId="ButtonToolbar">
                  <Col sm={9} smOffset={5}>
                    <ButtonToolbar>
                      <Button type="button" onClick={this.onResetForm} disabled={pristine || submitting}>Nhập lại</Button>
                      <Button type="submit" bsStyle="primary" disabled={pristine || submitting || invalid}>Cập nhật</Button>
                    </ButtonToolbar>
                  </Col>
                </FormGroup>
              </form>
            </Col>
          </Col>
        </Row>
      </Grid>);
  }
}

FeeSetting.propTypes = {
  buildingId: PropTypes.string.isRequired,
  user: PropTypes.shape({
    id: PropTypes.string,
    isAdmin: PropTypes.bool,
  }).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  form: PropTypes.string.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  currentValues: PropTypes.object.isRequired,
  initialValues: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  data: PropTypes.shape({
    loading: PropTypes.bool,
  }).isRequired,
  save: PropTypes.func.isRequired,
  initialize: PropTypes.func.isRequired,
};

const fields = [
  'automatedReminderAfterHowDays',
  'timeLimitationBetween2FeeNotifications',
];

const FeeSettingForm = reduxForm({
  form: 'FeeSettingBuildingForm',
  fields,
  touchOnChange: true,
  touchOnBlur: true,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
})(FeeSetting);

export default compose(
  withStyles(s),
  connect(state => ({
    user: state.user,
    currentValues: formValueSelector('FeeSettingBuildingForm')(state, ...fields),
  })),
  graphql(BuildingFeeSettingsQuery, {
    options: props => ({
      variables: {
        building: props.buildingId,
      },
    }),
    props: ({ data }) => ({
      data,
      initialValues: (data && data.getBuildingSettings && data.getBuildingSettings.fee) || {},
    }),
  }),
  graphql(BuildingFeeSettingsMutation, {
    props: ({ ownProps, mutate }) => ({
      save: fee => mutate({
        variables: {
          building: ownProps.buildingId,
          input: {
            fee,
          },
        },
      }),
    }),
  }),
)(FeeSettingForm);
