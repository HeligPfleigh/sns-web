import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import gql from 'graphql-tag';
import filter from 'lodash/filter';
import { graphql, compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import history from '../../../core/history';
import Loading from '../../../components/Loading';
import BuildingList from '../../../components/BuildingList';
import s from './styles.scss';

const BOMQuery = gql`query BOMQuery {
  me {
    _id
    buildings {
      _id
      display
      isAdmin
      totalApartment
      address {
        basisPoint
        country
        province
        district
        ward
        street
      }
    }
  }
}`;

class HomePage extends Component {

  componentWillReceiveProps = (nextProps) => {
    if (!nextProps.loading && nextProps.me) {
      const { me: { buildings } } = nextProps;
      if (buildings.length === 1) {
        // history.push(`/management/${buildings[0]._id}`);
      }
    }
  }

  onRedirect = (id) => {
    history.push(`/my-buildings/${id}`);
  }

  render() {
    const { loading, me } = this.props;

    // Show loading
    if (loading) {
      return <Loading show={loading} full>Đang tải ...</Loading>;
    }

    const dataSource = filter((me && me.buildings) || [], { isAdmin: true });

    return (
      <div className="container">
        <div className={s.containerTop30}>
          <BuildingList buildings={dataSource} onRedirect={this.onRedirect} />
        </div>
      </div>
    );
  }
}

HomePage.propTypes = {
  loading: PropTypes.bool.isRequired,
  me: PropTypes.object,
  // user: PropTypes.object.isRequired,
};

export default compose(
  withStyles(s),
  connect(state => ({
    user: state.user,
  })),
  graphql(BOMQuery, {
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
)(HomePage);

