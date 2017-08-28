import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Grid, Row, Col } from 'react-bootstrap';
import MediaQuery from 'react-responsive';

import s from './styles.scss';
import Menu from '../../Menu/Menu';
import Loading from '../../../../components/Loading';
import UploadFeeFile from '../../../../components/FeeManagement';

const getFeeTypes = gql`query {
  getFeeTypes {
    code
    name
  }
}`;

class FeeUploadPage extends Component {
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
              <Menu
                user={user}
                parentPath={`/management/${buildingId}`}
                pageKey="fee_management>fee_upload"
              />
            </Col>
          </MediaQuery>
          <Col md={9}>
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

FeeUploadPage.propTypes = {
  user: PropTypes.object.isRequired,
  feeTypes: PropTypes.array.isRequired,
  buildingId: PropTypes.string.isRequired,
};

export default compose(
  withStyles(s),
  connect(state => ({
    user: state.user,
  })),
  graphql(getFeeTypes, {
    options: () => ({
      fetchPolicy: 'network-only',
    }),
    props: ({ data }) => ({
      feeTypes: data.getFeeTypes,
    }),
  }),
)(FeeUploadPage);
