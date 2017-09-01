import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import { compose, graphql } from 'react-apollo';
import { Grid, Row, Col } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import s from './styles.scss';
import Menu from '../Menu/Menu';
import Loading from '../../../components/Loading';
import feesOfApartment from './feesOfApartment.graphql';
import feeServiceQueries from './feeServiceQueries.graphql';
import FeeServices from '../../../components/Apartment/FeeServices/FeeServices';

class FeeServicesPage extends Component {
  render() {
    const {
      user,
      data,
      feeTypes,
      apartment,
      apartmentId,
      loadMoreRows,
    } = this.props;

    // Show loading
    if (data && data.loading) {
      return <Loading show={data.loading} full>Đang tải ...</Loading>;
    }

    return (
      <Grid>
        <Row className={s.containerTop30}>
          <MediaQuery minDeviceWidth={992} values={{ deviceWidth: 1600 }}>
            <Col md={3} smHidden xsHidden>
              <Menu
                apartment={apartment}
                user={user}
                parentPath={`/apartment/${apartmentId}`}
                pageKey="service_fee"
              />
            </Col>
          </MediaQuery>
          <Col md={9} sm={12} xs={12}>
            <FeeServices
              fees={data}
              apartment={apartment}
              feeTypes={feeTypes || []}
              loadMoreRows={loadMoreRows}
            />
          </Col>
        </Row>
      </Grid>
    );
  }
}

FeeServicesPage.propTypes = {
  data: PropTypes.array,
  feeTypes: PropTypes.array,
  apartment: PropTypes.object,
  user: PropTypes.object.isRequired,
  apartmentId: PropTypes.string.isRequired,
  loadMoreRows: PropTypes.func,
};

export default compose(
  withStyles(s),
  connect(state => ({
    user: state.user,
  })),
  graphql(feesOfApartment, {
    options: ownProps => ({
      variables: {
        apartmentId: ownProps.apartmentId,
      },
      fetchPolicy: 'network-only',
    }),
    props: ({ data }) => {
      const { fetchMore } = data;

      const loadMoreRows = (variables) => {
        fetchMore({
          variables,
          fetchPolicy: 'network-only',
          updateQuery: (_, { fetchMoreResult }) => fetchMoreResult,
        });
      };
      return {
        loadMoreRows,
        data: data.feesOfApartment || [],
      };
    },
  }),
  graphql(feeServiceQueries, {
    options: ownProps => ({
      variables: {
        _id: ownProps.apartmentId,
      },
    }),
    props: ({ data }) => ({
      feeTypes: data.getFeeTypes,
      apartment: data.apartment,
    }),
  }),
)(FeeServicesPage);
