import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { Row, Col } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Loading from '../../../components/Loading';
import ApartmentItem from './ApartmentItem';
import history from '../../../core/history';
import s from './styles.scss';


const getApartments = gql`query getApartments {
  me {
    _id,
    username,
    profile {
      picture,
      firstName,
      lastName
    }
    apartments {
      _id
      number
      isOwner
      prefix
      name
      createdAt
      updatedAt
    }
  },
}`;

class ApartmentList extends Component {

  componentWillReceiveProps = (nextProps) => {
    if (!nextProps.loading && nextProps.me) {
      const { me: { apartments } } = nextProps;
      if (apartments.length === 1) {
        history.push(`/apartment/${apartments[0]._id}`);
      }
    }
  }

  render() {
    const { me } = this.props;
    const { loading } = this.props;

    if (loading) {
      return <Loading show={loading} full>Đang tải ...</Loading>;
    }

    return (
      <div className="container">
        <div className={s.containerTop30}>
          <div className={s.apartments}>
            <h4>Căn hộ đang sử dụng</h4>
            <Row>
              <Col md={12}>
                { ((me && me.apartments) || []).map(apartment => <ApartmentItem
                  key={Math.random()}
                  apartment={apartment}
                />) }
              </Col>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}
ApartmentList.propTypes = {
  loading: PropTypes.bool.isRequired,
  me: PropTypes.object,
};

export default compose(
  withStyles(s),
  connect(state => ({
    user: state.user,
  })),
  graphql(getApartments, {
    options: () => ({
      variables: {},
      fetchPolicy: 'network-only',
    }),
    props: ({ data }) => {
      if (!data.me) {
        return {
          loading: data.loading,
        };
      }

      const { me } = data;
      return {
        loading: data.loading,
        me,
      };
    },
  }),
)(ApartmentList);
