import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import moment from 'moment';
import { Grid, Row, Col } from 'react-bootstrap';
import announcementQuery from './announcementQuery.graphql';
import {
  BuildingAnnouncementItem,
} from '../../components/BuildingAnnouncementList';
import s from './AnnouncementDetail.scss';

class AnnouncementDetail extends Component {
  render() {
    const {
      data: {
        loading,
        announcement,
        resident,
      },
    } = this.props;
    let announcements = null;
    if (resident) {
      announcements = resident.announcements;
    }
    return (
      <Grid>
        {loading && <h3>Đang tải dữ liệu....</h3>}
        <Row>
          <Col md={8} sm={12} xs={12} className={s.container}>
            {!loading && announcement &&
              <div className={s.announcement}>
                <div className={s.announcementTitle}>
                  <span>{announcement.message}</span>
                  <br />
                  <small>{moment(announcement.date).format('HH:mm  DD/MM/YYYY')}</small>
                </div>
                <div>
                  <p>{announcement.description}</p>
                </div>
              </div>
            }
            <div>
              <div>
                <span>Thông báo khác</span>
              </div>
              <ul className={s.announcementList}>
                {
                  !loading && announcements && announcements.edges.map(a => (
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
        </Row>
      </Grid>
    );
  }
}

AnnouncementDetail.propTypes = {
  data: PropTypes.shape({}).isRequired,
};

export default compose(
  withStyles(s),
  connect(state => ({
    user: state.user,
  })),
  graphql(announcementQuery, {
    options: props => ({
      variables: {
        announcementId: props.announcementId,
        userId: props.user.id,
        limit: 4,
        cursor: null,
      },
      fetchPolicy: 'network-only',
    }),
  }),
)(AnnouncementDetail);
