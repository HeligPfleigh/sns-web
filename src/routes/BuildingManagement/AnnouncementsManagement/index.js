import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Grid, Row, Col, Pagination } from 'react-bootstrap';
import MediaQuery from 'react-responsive';
import Loading from '../../../components/Loading';
import Menu from '../Menu/Menu';
import announcementsQuery from './announcementsQuery.graphql';
import {
  BuildingAnnouncementItem,
} from '../../../components/BuildingAnnouncementList';
import s from './style.scss';

const limit = 4;

class AnnouncementsManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      currentPage: 1,
    };
  }

  handlePageSelect = (pageNum) => {
    this.setState(prevState => ({
      ...prevState,
      currentPage: pageNum,
    }), () => {
      this.handleFilter();
    });
  }

  handleFilter = () => {
    const { currentPage: page } = this.state;
    const skip = (page - 1) * limit;
    const { buildingId } = this.props;
    this.props.loadMoreRows({ buildingId, limit, skip });
  }

  render() {
    const { loading, currentPage } = this.state;
    const {
      buildingId,
      user,
      building,
    } = this.props;
    let announcements = null;
    const pagination = {
      totalPage: 1,
      currentPage,
    };

    if (building) {
      announcements = building.announcements;
      const countRecord = (announcements.pageInfo && announcements.pageInfo.total) || 1;
      if (countRecord <= limit) {
        pagination.totalPage = 1;
      } else {
        pagination.totalPage = Math.ceil(countRecord / limit);
      }
    }

    return (
      <Grid>
        <Loading show={loading} full>Đang tải ...</Loading>
        <Row className={s.containerTop30}>
          <MediaQuery minDeviceWidth={992} values={{ deviceWidth: 1600 }}>
            <Col md={3} smHidden xsHidden>
              <Menu
                user={user}
                parentPath={`/management/${buildingId}`}
                pageKey="announcements_management>announcements"
              />
            </Col>
          </MediaQuery>
          <Col md={9} sm={12} xs={12}>
            <div className={s.container}>
              <Col md={12} className={s.contentMain}>
                <div className={s.header}>
                  <i className="fa fa-bullhorn" aria-hidden="true"></i>
                  <span className={s.headerTitle}>Thông báo</span>
                </div>
                <ul className={s.announcementList}>
                  {
                    !loading && announcements && announcements.edges.map(a => (
                      <BuildingAnnouncementItem
                        key={a._id}
                        data={a}
                        message={a.message}
                        displayAction
                      />
                    ))
                  }
                </ul>
                <div className="pull-right">
                  <Pagination
                    maxButtons={3}
                    prev={pagination.totalPage > 5}
                    next={pagination.totalPage > 5}
                    first={pagination.totalPage > 5}
                    last={pagination.totalPage > 5}
                    ellipsis={pagination.totalPage > 5}
                    items={pagination.totalPage}
                    activePage={pagination.currentPage}
                    onSelect={this.handlePageSelect}
                  />
                </div>
              </Col>
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }
}

AnnouncementsManagement.propTypes = {
  building: PropTypes.object,
  loadMoreRows: PropTypes.func,
  user: PropTypes.object.isRequired,
  buildingId: PropTypes.string.isRequired,
};

export default compose(
  connect(state => ({
    user: state.user,
  })),
  withStyles(s),
  graphql(announcementsQuery, {
    options: ownProps => ({
      variables: {
        buildingId: ownProps.buildingId,
        limit,
        skip: 0,
      },
      fetchPolicy: 'network-only',
    }),
    props: ({ data }) => {
      const {
        fetchMore,
        building,
      } = data;

      const loadMoreRows = (variables) => {
        fetchMore({
          variables,
          fetchPolicy: 'network-only',
          updateQuery: (_, { fetchMoreResult }) => fetchMoreResult,
        });
      };
      return {
        building,
        loadMoreRows,
      };
    },
  }),
)(AnnouncementsManagement);
