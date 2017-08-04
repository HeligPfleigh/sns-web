import React, { Component, PropTypes } from 'react';
import { graphql, compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Grid, Row, Col } from 'react-bootstrap';
import gql from 'graphql-tag';
import MediaQuery from 'react-responsive';
import InfiniteScroll from 'react-infinite-scroller';
import update from 'immutability-helper';
import Loading from '../../components/Loading';
import s from './Events.scss';

class Events extends React.Component {
  render() {
    return (
      <Grid>
        <Loading show={loading} full>Đang tải ...</Loading>
        <Row className={s.containerTop30}>
          <Col md={8} sm={12} xs={12}>
          </Col>
        </Row>
      </Grid>
    );
  }
}

