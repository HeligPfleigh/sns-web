import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Grid, Row, Col } from 'react-bootstrap';
import MediaQuery from 'react-responsive';
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
            <EventList
              user={this.props.user}
            />
          </Col>
        </Row>
      </Grid>
    );
  }
}

Events.propTypes = {
  user: PropTypes.object.isRequired,
};

export default compose(
  connect(state => ({
    user: state.user,
  })),
  withStyles(s),
)(Events);

