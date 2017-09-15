import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import update from 'immutability-helper';
import throttle from 'lodash/throttle';
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import moment from 'moment';
import { Grid, Row, Col } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroller';
import { generate as idRandom } from 'shortid';
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
      loadMoreRows,
    } = this.props;
    let announcements = null;
    let hasNextPage = false;
    if (resident) {
      announcements = resident.announcements;
      hasNextPage = resident.announcements.pageInfo.hasNextPage;
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
              <InfiniteScroll
                loadMore={loadMoreRows}
                hasMore={hasNextPage}
                loader={<div className="loader">Loading ...</div>}
              >
                <ul className={s.announcementList}>
                  {
                    !loading && announcements && announcements.edges.map(a => (
                      <BuildingAnnouncementItem
                        key={idRandom()}
                        data={a}
                        message={a.message}
                      />
                    ))
                  }
                </ul>
              </InfiniteScroll>
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }
}

AnnouncementDetail.propTypes = {
  data: PropTypes.shape({}).isRequired,
  loadMoreRows: PropTypes.func.isRequired,
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
    props: ({ data }) => {
      const { fetchMore } = data;
      const loadMoreRows = throttle(() => fetchMore({
        variables: {
          cursor: data.resident.announcements.pageInfo.endCursor,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newEdges = fetchMoreResult.resident.announcements.edges;
          const pageInfo = fetchMoreResult.resident.announcements.pageInfo;
          return update(previousResult, {
            resident: {
              announcements: {
                edges: {
                  $push: newEdges,
                },
                pageInfo: {
                  $set: pageInfo,
                },
              },
            },
          });
        },
      }), 300);
      return {
        data,
        loadMoreRows,
      };
    },
  }),
)(AnnouncementDetail);
