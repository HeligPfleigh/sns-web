import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { graphql, compose } from 'react-apollo';
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
        building,
      },
    } = this.props;
    return (
      <Grid>
        {loading && <div> Đang tải dữ liệu...</div>}
        <Row>
          <Col md={8} sm={12} xs={12} className={s.container}>
            <div className={s.header}>
              <h3>Các thông báo</h3>
            </div>
            <ul className={s.buildingAnnouncementList}>
              {
                !loading && building && building.announcements && building.announcements.edges.map(a => (
                  <BuildingAnnouncementItem
                    key={a._id}
                    data={a}
                    message={a.message}
                  />
                ))
              }
            </ul>
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
  graphql(buildingAnnouncementPageQuery, {
    options: ownProps => ({
      variables: {
        buildingId: ownProps.buildingId,
      },
      fetchPolicy: 'network-only',
    }),
  }),
)(BuildingAnnouncementPage);
