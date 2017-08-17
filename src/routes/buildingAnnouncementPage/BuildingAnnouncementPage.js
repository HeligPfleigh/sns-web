import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { graphql, compose } from 'react-apollo';
import { Grid, Row, Col } from 'react-bootstrap';
import buildingAnnouncementPageQuery from './buildingAnnouncementPageQuery.graphql';
import {
  BuildingAnnouncementItem,
} from '../../components/BuildingAnnouncementList';
import s from './BuildingAnnouncementPage.scss';

class BuildingAnnouncementPage extends React.Component {
  render() {
    const {
      data: {
        loading,
        building,
      },
    } = this.props;
    return (
      <div className={s.containerTop30}>
        <Grid>
          {loading && <div> Đang tải dữ liệu...</div>}
          <Row>
            <Col md={8} sm={12} xs={12} style={{ listStyle: 'none' }}>
              {
                !loading && building && building.announcements && building.announcements.edges.map(a => (
                  <BuildingAnnouncementItem
                    key={a._id}
                    data={a}
                    message={a.message}
                  />
                ))
              }
            </Col>
          </Row>
        </Grid>
      </div>
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
