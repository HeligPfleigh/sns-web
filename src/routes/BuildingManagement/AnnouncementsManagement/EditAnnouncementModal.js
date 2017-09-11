import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import { generate as idRandom } from 'shortid';
import { FormGroup, Dropdown, MenuItem, Button, Modal } from 'react-bootstrap';
import {
  Field,
  reduxForm,
  formValueSelector,
  change as changeState,
} from 'redux-form';

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { TextField, TextAreaField, SelectApartmentsField } from '../../../components/FormFields';
import {
  required,
  minLength2,
} from '../../../utils/validator';
import {
  PUBLIC,
  PRIVATE,
} from '../../../constants';
import apartmentsQuery from '../NewAnnouncement/apartmentsQuery.graphql';
import s from './style.scss';

const selector = formValueSelector('editAnnouncementForm');

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

class EditAnnouncementModal extends Component {

  onSelectPrivary = (eventKey, event) => {
    event.preventDefault();
    this.props.changeState('editAnnouncementForm', 'privacy', eventKey);
  }

  submit = (values) => {
    let apartments = [];
    const { privacy, message, description, date } = values;
    if (privacy === PRIVATE && values.apartments) {
      apartments = values.apartments.map(i => i._id);
    }
    if (privacy === PUBLIC) {
      apartments = [];
    }
    this.props.clickModal({ message, description, privacy, apartments, date });
  }

  render() {
    const {
      data: {
        building,
      },
      handleSubmit,
      submitting,
      privacy,
    } = this.props;
    let apartments = null;
    if (building) {
      apartments = building.apartments;
    }
    return (
      <Modal show={this.props.show} onHide={this.props.closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa thông báo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
            { apartments && privacy === PRIVATE &&
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
              <div className="displayFormRight">
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
                  <button type="button" onClick={this.props.closeModal} className="btn btn-default" style={{ marginRight: '5px' }}>
                    Hủy
                  </button>
                  <button type="submit" disabled={submitting} className="btn btn-primary" >
                    Chỉnh sửa xong
                  </button>
                </div>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    );
  }
}

EditAnnouncementModal.propTypes = {
  data: PropTypes.shape({}).isRequired,
  show: PropTypes.bool,
  closeModal: PropTypes.func,
  clickModal: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  privacy: PropTypes.string.isRequired,
  changeState: PropTypes.func.isRequired,
};

const EditAnnouncementReduxForm = reduxForm({
  // a unique name for the form
  form: 'editAnnouncementForm',
})(EditAnnouncementModal);

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
  connect(
    state => ({
      privacy: selector(state, 'privacy'),
    }),
    {
      changeState,
    },
  ),
)(EditAnnouncementReduxForm);
