import React, { Component, PropTypes } from 'react';
import { graphql, compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Grid, Row, Col } from 'react-bootstrap';
import gql from 'graphql-tag';
import MediaQuery from 'react-responsive';
import InfiniteScroll from 'react-infinite-scroller';
import update from 'immutability-helper';
import Loading from '../../components/Loading';
import {
  EventList,
  EventMenu,
} from '../../components/EventsComponents';
import s from './Events.scss';

class Events extends Component {
  state= {
    loading: false,
  }
  onCreateEvent = () => {

  }
  render() {
    const { loading } = this.state;
    return (
      <Grid>
        <Loading show={loading} full>Đang tải ...</Loading>
        <Row className={s.containerTop30}>
          <MediaQuery minDeviceWidth={992} values={{ deviceWidth: 1600 }}>
            <Col md={3} smHidden xsHidden>
              <EventMenu
                onCreateEvent={this.onCreateEvent}
              />
            </Col>
          </MediaQuery>
          <Col md={9} sm={12} xs={12}>
            <EventList />
          </Col>
        </Row>
      </Grid>
    );
  }
}

Events.propTypes = {

};

export default compose(
  withStyles(s),
)(Events);

