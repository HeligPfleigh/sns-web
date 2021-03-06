import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import { generate as idRandom } from 'shortid';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { FormGroup, Dropdown, MenuItem, Button } from 'react-bootstrap';
import { Field, reduxForm, reset as resetReduxForm } from 'redux-form';
import { openAlertGlobal } from '../../../../reducers/alert';
import apartmentsQuery from '../apartmentsQuery.graphql';
import createNewAnnouncementMutation from '../createNewAnnouncementMutation.graphql';
import {
  required,
  minLength2,
} from '../../../../utils/validator';
import {
  PUBLIC,
  PRIVATE,
} from '../../../../constants';
import { TextField, TextAreaField, SelectApartmentsField } from '../../../../components/FormFields';
import s from './NewAnnouncementForm.scss';

const PRIVARY_TEXT = {
  PUBLIC: 'Công khai',
  PRIVATE: 'Riêng tư',
};

const CustomToggle = ({ onClick, children }) => (
  <Button onClick={onClick}>
    { children }
  </Button>
);

CustomToggle.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node,
};

class NewAnnouncementForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      privacy: PUBLIC,
      displaySelectApartments: false,
    };
  }

  onSelectPrivary = (eventKey, event) => {
    event.preventDefault();
    if (eventKey === PRIVATE) {
      this.setState({
        privacy: eventKey,
        displaySelectApartments: true,
      });
    } else {
      this.setState({
        privacy: eventKey,
        displaySelectApartments: false,
      });
    }
  }

  submit = (values) => {
    const { privacy } = this.state;
    let apartments = [];
    const { message, description } = values;
    if (values.apartments) {
      apartments = values.apartments.map(i => i._id);
    }
    this.props.createNewAnnouncement(message, description, apartments, privacy)
    .then(() => {
      this.props.resetForm();
      this.props.openAlertGlobalAction({
        message: 'Bạn đã đăng thông báo thành công',
        open: true,
        autoHideDuration: 0,
      });
    }).catch((error) => {
      console.log('there was an error sending the query', error);
    });
  }

  render() {
    const {
      data: {
        building,
      },
      handleSubmit,
      submitting,
      reset,
    } = this.props;
    const { privacy, displaySelectApartments } = this.state;
    let apartments = null;
    if (building) {
      apartments = building.apartments;
    }
    return (
      <div>
        <form onSubmit={handleSubmit(this.submit)}>
          <FormGroup className={s.displayForm}>
            <div className={s.displayFormLeft}>
              <label>Tiêu đề</label>
            </div>
            <Field
              name="message"
              type="text"
              component={TextField}
              placeholder="Tiêu đề"
              validate={[required, minLength2]}
            />
          </FormGroup>
          <FormGroup className={s.displayForm}>
            <div className={s.displayFormLeft}>
              <label>Nội dung</label>
            </div>
            <Field
              name="description"
              componentClass="textarea"
              component={TextAreaField}
              placeholder="Nội dung"
              validate={[required, minLength2]}
            />
          </FormGroup>
          {apartments && displaySelectApartments &&
            <FormGroup className={s.displayForm}>
              <div className={s.displayFormLeft}>
                <label>Các căn hộ</label>
              </div>
              <Field
                name="apartments"
                multi
                valueKey="_id"
                labelKey="name"
                dataSource={apartments}
                component={SelectApartmentsField}
                placeholder="Chọn các căn hộ cần gửi thông báo"
                validate={[required]}
              />
            </FormGroup>
          }
          <div className={s.newAnnouncementControl}>
            <div className={s.displayFormLeft}></div>
            <div className={s.displayFormRight}>
              <div className="pull-left">
                <button className={s.addPhoto} disabled>
                  <i className="fa fa-camera fa-lg" aria-hidden="true"></i>&nbsp;
                  <strong>Ảnh</strong>
                </button>
              </div>
              <div className="pull-right">
                <Dropdown
                  className={s.setPrivaryBtn}
                  style={{ marginRight: '5px' }}
                  id={idRandom()}
                >
                  <CustomToggle bsRole="toggle">
                    <span title={PRIVARY_TEXT[privacy]}>
                      {PRIVARY_TEXT[privacy]} <i className="fa fa-caret-down" aria-hidden="true"></i>
                    </span>
                  </CustomToggle>
                  <Dropdown.Menu onSelect={this.onSelectPrivary}>
                    <MenuItem eventKey={PUBLIC}>Công khai</MenuItem>
                    <MenuItem eventKey={PRIVATE}>Riêng tư</MenuItem>
                  </Dropdown.Menu>
                </Dropdown>
                <button type="button" onClick={reset} className="btn btn-default" style={{ marginRight: '5px' }}>
                  Hủy
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary" >
                  Gửi
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

NewAnnouncementForm.propTypes = {
  data: PropTypes.shape({}).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  reset: PropTypes.func.isRequired,
  createNewAnnouncement: PropTypes.func.isRequired,
  openAlertGlobalAction: PropTypes.func,
  resetForm: PropTypes.func,
};

const NewAnnouncementReduxForm = reduxForm({
  // a unique name for the form
  form: 'newAnnouncementForm',
})(NewAnnouncementForm);

export default compose(
  withStyles(s),
  graphql(apartmentsQuery, {
    options: ownProps => ({
      variables: {
        buildingId: ownProps.buildingId,
      },
      fetchPolicy: 'network-only',
    }),
  }),
  graphql(createNewAnnouncementMutation, {
    props: ({ ownProps, mutate }) => ({
      createNewAnnouncement: (message, description, apartments, privacy) => mutate({
        variables: {
          input: {
            message,
            description,
            apartments,
            privacy,
            buildingId: ownProps.buildingId,
          },
        },
      }),
    }),
  }),
)(connect(
  null,
  dispatch => ({
    openAlertGlobalAction: data => dispatch(openAlertGlobal(data)),
    resetForm: () => dispatch(resetReduxForm('newAnnouncementForm')),
  }),
)(NewAnnouncementReduxForm));
