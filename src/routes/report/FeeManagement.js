import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Grid, Row, Col } from 'react-bootstrap';
import MediaQuery from 'react-responsive';
import Loading from '../../components/Loading';
import s from './FeeManagement.scss';
import getFeeTypes from './getFeeTypes.graphql';
import {
  UploadFeeFile,
  Menu,
} from '../../components/FeeManagement';
import config from '../../config';

class FeeManagement extends Component {
  state= {
    loading: false,
  }

  render() {
    const { loading } = this.state;
    const { buildingId, user, feeTypes } = this.props;
    return (
      <Grid>
        <Loading show={loading} full>Đang tải ...</Loading>
        <Row className={s.containerTop30}>
          <MediaQuery minDeviceWidth={992} values={{ deviceWidth: 1600 }}>
            <Col md={3} smHidden xsHidden>
              <Menu user={user} />
            </Col>
          </MediaQuery>
          <Col md={9} sm={12} xs={12}>
            <UploadFeeFile
              buildingId={buildingId}
              feeTypes={feeTypes}
            />
          </Col>
        </Row>
      </Grid>
    );
  }
}

FeeManagement.propTypes = {
  user: PropTypes.object.isRequired,
  feeTypes: PropTypes.array.isRequired,
  buildingId: PropTypes.string.isRequired,
};

export default compose(
  connect(state => ({
    user: state.user,
  })),
  withStyles(s),
  graphql(getFeeTypes, {
    options: () => ({
      fetchPolicy: 'network-only',
    }),
    props: ({ data }) => ({
      feeTypes: data.getFeeTypes,
    }),
  }),
)(FeeManagement);

