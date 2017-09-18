import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import classNames from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Grid, Row, Col } from 'react-bootstrap';
import Loading from '../../../components/Loading';
import FAQs from '../../../components/MyBuildings/FAQs';
import Banner from '../../../components/MyBuildings/Banner';
import Documents from '../../../components/MyBuildings/Documents';
import BuildingServices from '../../../components/MyBuildings/Services';
import Annoucements from '../../../components/MyBuildings/Annoucements';
import BuildingInfo from '../../../components/MyBuildings/BuildingInfo';
import myBuildingQueries from './graphql/MyBuildingQueries.graphql';
import s from './MyBuilding.scss';

class MyBuilding extends Component {

  render() {
    const {
      loading,
      admins,
      building,
      listFAQ,
      documents,
      buildingId,
      announcements,
    } = this.props;

    if (loading) {
      return <Loading show={loading} full>Đang tải ...</Loading>;
    }

    return (
      <Grid className={classNames(s.containerTop30)}>
        <Col md={12} className={classNames(s.container)}>
          <Banner />
          <div className={classNames(s.mainContent)}>
            <Row>
              <Col md={6} sm={6} xs={12}>
                <Annoucements announcements={announcements} isNew />
              </Col>
              <Col md={6} sm={6} xs={12}>
                <BuildingInfo buildingInfo={building} admins={admins} />
              </Col>
            </Row>
            { /* <BuildingServices buildingId={buildingId} /> */ }
            <Row>
              <Col md={6} sm={6} xs={12}>
                { listFAQ && <FAQs buildingId={buildingId} listFAQ={listFAQ} /> }
              </Col>
              <Col md={6} sm={6} xs={12}>
                { documents && <Documents buildingId={buildingId} documents={documents} /> }
              </Col>
            </Row>
          </div>
        </Col>
      </Grid>
    );
  }
}

MyBuilding.propTypes = {
  building: PropTypes.object,
  admins: PropTypes.array,
  listFAQ: PropTypes.array,
  documents: PropTypes.array,
  announcements: PropTypes.array,
  loading: PropTypes.bool.isRequired,
  buildingId: PropTypes.string.isRequired,
};

export default compose(
  connect(state => ({
    user: state.user,
  })),
  withStyles(s),
  graphql(myBuildingQueries, {
    options: ownProps => ({
      variables: {
        limit: 4,
        building: ownProps.buildingId,
        userId: ownProps.user.id,
      },
    }),
    props: ({ data }) => {
      const {
        loading,
        building,
        getBOMList,
        resident: me,
        FAQs: listFAQ,
        documents: docs,
      } = data;

      let announcements = [];
      if (me && me.announcements) {
        announcements = me.announcements.edges;
      }

      return {
        loading,
        building,
        admins: getBOMList,
        announcements,
        documents: docs && docs.edges,
        listFAQ: listFAQ && listFAQ.edges,
      };
    },
  }),
)(MyBuilding);
