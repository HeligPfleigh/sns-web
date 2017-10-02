import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import moment from 'moment';
import isEmpty from 'lodash/isEmpty';
import { Grid, Row, Col } from 'react-bootstrap';
import { generate as idRandom } from 'shortid';
import announcementQuery from './announcementQuery.graphql';
import {
  BuildingAnnouncementItem,
} from '../../components/BuildingAnnouncementList';

import Loading from '../../components/Loading';
import s from './AnnouncementDetail.scss';
import history from '../../core/history';

class AnnouncementDetail extends Component {

  backAnnouncementsManagement = () => {
    const { query } = this.props;
    if (!isEmpty(query)) {
      if (query.privacy === 'public') {
        // go to public annoucement page
        return history.push('/announcements');
      }

      // go to management page
      return history.push('/management/58da279f0ff5af8c8be59c36/announcement/list');
    }

    // previous history
    return history.goBack();
  }

  render() {
    const {
      data: {
        loading,
        announcement,
        resident,
      },
      user,
      query,
    } = this.props;

    let announcements = null;
    if (resident) {
      announcements = resident.announcements;
    }

    return (
      <Grid>
        {loading && <Loading full show={loading}>Đang tải dữ liệu....</Loading>}
        <Row>
          <Col md={8} sm={12} xs={12} className={s.container}>
            { user && user.isAdmin &&
              <div onClick={this.backAnnouncementsManagement}>
                <i className="fa fa-chevron-left" aria-hidden="true"></i>
                <h4 className={s.buttonBack}>Quay lại trang</h4>
              </div>
            }
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
                      key={idRandom()}
                      data={a}
                      privacy={query.privacy}
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
  query: PropTypes.object,
  data: PropTypes.shape({}).isRequired,
  user: PropTypes.object.isRequired,
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
        cursor: null,
        limit: 5,
      },
      fetchPolicy: 'network-only',
    }),
  }),
)(AnnouncementDetail);
