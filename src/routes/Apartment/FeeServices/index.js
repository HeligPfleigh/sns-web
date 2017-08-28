import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Grid, Row, Col } from 'react-bootstrap';
import MediaQuery from 'react-responsive';
import Loading from '../../../components/Loading';
import Menu from '../Menu/Menu';
import feesOfApartment from './feesOfApartment.graphql';
import apartment from './apartment.graphql';
import FeeServices from '../../../components/Apartment/FeeServices/FeeServices';
import s from './styles.scss';

const currentDate = new Date();

class FeeServicesPage extends Component {
  state= {
    loading: false,
  }
  render() {
    const { loading } = this.state;
    const { apartmentId, user, data, apartment } = this.props;
    return (
      <Grid>
        <Loading show={loading} full>Đang tải ...</Loading>
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
              apartment={apartment}
              fees={data}
            />
          </Col>
        </Row>
      </Grid>
    );
  }
}

FeeServicesPage.propTypes = {
  user: PropTypes.object.isRequired,
  apartmentId: PropTypes.string.isRequired,
  data: PropTypes.array,
  apartment: PropTypes.object,
};

export default compose(
  connect(state => ({
    user: state.user,
  })),
  withStyles(s),
  graphql(feesOfApartment, {
    options: ownProps => ({
      variables: {
        apartmentId: ownProps.apartmentId,
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
      },
    }),
    props: ({ data }) => ({
      data: data.feesOfApartment.edges,
    }),
  }),
  graphql(apartment, {
    options: ownProps => ({
      variables: {
        _id: ownProps.apartmentId,
      },
    }),
    props: ({ data }) => ({
      apartment: data.apartment,
    }),
  }),
)(FeeServicesPage);
