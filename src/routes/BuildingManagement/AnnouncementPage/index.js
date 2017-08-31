import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import { reset } from 'redux-form';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Grid, Row, Col } from 'react-bootstrap';
import MediaQuery from 'react-responsive';
import Loading from '../../../components/Loading';
import Menu from '../Menu/Menu';
import NewAnnouncementForm from './NewAnnouncementForm';
import { openAlertGlobal } from '../../../reducers/alert';
import createNewBuildingAnnouncementMutation from './createNewBuildingAnnouncementMutation.graphql';
import s from './styles.scss';

class Announcement extends Component {
  state= {
    loading: false,
  }

  submit = (evt, values) => {
    const { message, description } = values;
    this.props.createNewBuildingAnnouncement(message, description)
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
    const { loading } = this.state;
    const { buildingId, user } = this.props;

    return (
      <Grid>
        <Loading show={loading} full>Đang tải ...</Loading>
        <Row className={s.containerTop30}>
          <MediaQuery minDeviceWidth={992} values={{ deviceWidth: 1600 }}>
            <Col md={3} smHidden xsHidden>
              <Menu
                user={user}
                parentPath={`/management/${buildingId}`}
                pageKey="noti_other"
              />
            </Col>
          </MediaQuery>
          <Col md={9} sm={12} xs={12}>
            <div className={s.container}>
              <Col md={12} className={s.contentMain}>
                <div className={s.header}>
                  <i className="fa fa-bullhorn" aria-hidden="true"></i>
                  <span className={s.headerTitle}>Thông báo khác</span>
                </div>
                <NewAnnouncementForm
                  onSubmit={this.submit}
                />
              </Col>
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }
}

Announcement.propTypes = {
  user: PropTypes.object.isRequired,
  createNewBuildingAnnouncement: PropTypes.func.isRequired,
  buildingId: PropTypes.string.isRequired,
  openAlertGlobalAction: PropTypes.func,
  resetForm: PropTypes.func,
};

export default compose(
  connect(state => ({
    user: state.user,
  })),
  withStyles(s),
  graphql(createNewBuildingAnnouncementMutation, {
    props: ({ ownProps, mutate }) => ({
      createNewBuildingAnnouncement: (message, description) => mutate({
        variables: {
          input: {
            buildingId: ownProps.buildingId,
            announcementInput: {
              message,
              description,
            },
          },
        },
      }),
    }),
  }),
)(connect(
  null,
  dispatch => ({
    openAlertGlobalAction: data => dispatch(openAlertGlobal(data)),
    resetForm: () => dispatch(reset('newAnnouncementForm')),
  }),
)(Announcement));
