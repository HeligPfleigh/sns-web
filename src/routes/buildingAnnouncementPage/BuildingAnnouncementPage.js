import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-bootstrap';
import MediaQuery from 'react-responsive';
import FriendSuggestions from '../FriendSuggestions';
import ChatSideBar from '../ChatSideBar';
import buildingAnnouncementPageQuery from './buildingAnnouncementPageQuery.graphql';
import {
  BuildingAnnouncementItem,
} from '../../components/BuildingAnnouncementList';
import s from './BuildingAnnouncementPage.scss';

class BuildingAnnouncementPage extends Component {
  render() {
    const {
      data: {
        loading,
        resident,
      },
    } = this.props;
    let announcements = null;
    let otherAnnouncements = null;
    if (resident) {
      announcements = resident.announcements;
      otherAnnouncements = resident.otherAnnouncements;
    }
    return (
      <Grid>
        {loading && <h3>Đang tải dữ liệu...</h3>}
        <Row>
          <Col md={8} sm={12} xs={12} className={s.container}>
            <div className={s.announcements}>
              <div className={s.header}>
                <h3>Thông báo mới nhất</h3>
              </div>
              <ul className={s.announcementList}>
                {
                  !loading && announcements && announcements.edges.map(a => (
                    <BuildingAnnouncementItem
                      key={a._id}
                      data={a}
                      message={a.message}
                      privacy="public"
                    />
                  ))
                }
              </ul>
            </div>
            <div className={s.otherAnnouncements}>
              <div className={s.header}>
                <h3>Thông báo khác</h3>
              </div>
              <ul className={s.announcementList}>
                {
                  !loading && otherAnnouncements && otherAnnouncements.edges.map(a => (
                    <BuildingAnnouncementItem
                      key={a._id}
                      data={a}
                      message={a.message}
                    />
                  ))
                }
              </ul>
            </div>
          </Col>
          <MediaQuery minDeviceWidth={992} values={{ deviceWidth: 1600 }}>
            <Col md={4} smHidden xsHidden>
              <ChatSideBar />
              <FriendSuggestions />
            </Col>
          </MediaQuery>
        </Row>
      </Grid>
    );
  }
}

BuildingAnnouncementPage.propTypes = {
  data: PropTypes.shape({}).isRequired,
};

export default compose(
  withStyles(s),
  connect(state => ({
    user: state.user,
  })),
  graphql(buildingAnnouncementPageQuery, {
    options: ownProps => ({
      variables: {
        userId: ownProps.user.id,
        limit: 4,
        cursor: null,
        skip: 4,
      },
      fetchPolicy: 'network-only',
    }),
  }),
)(BuildingAnnouncementPage);
