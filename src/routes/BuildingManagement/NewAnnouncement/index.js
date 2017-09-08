import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Grid, Row, Col } from 'react-bootstrap';
import MediaQuery from 'react-responsive';
import Loading from '../../../components/Loading';
import Menu from '../Menu/Menu';
import NewAnnouncementForm from './NewAnnouncementForm';
import s from './styles.scss';

class Announcement extends Component {
  state= {
    loading: false,
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
              { user && <Menu
                user={user}
                parentPath={`/management/${buildingId}`}
                pageKey="announcements_management>create_announcement"
              /> }
            </Col>
          </MediaQuery>
          <Col md={9} sm={12} xs={12}>
            <div className={s.container}>
              <Col md={12} className={s.contentMain}>
                <div className={s.header}>
                  <i className="fa fa-bullhorn" aria-hidden="true"></i>
                  <span className={s.headerTitle}>Tạo thông báo mới</span>
                </div>
                <NewAnnouncementForm
                  buildingId={buildingId}
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
  buildingId: PropTypes.string.isRequired,
};

export default compose(
  connect(state => ({
    user: state.user,
  })),
  withStyles(s),
)(Announcement);
