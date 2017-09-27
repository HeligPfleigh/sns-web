import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { Row, Col } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import Loading from '../../Loading';
import FriendItem from './FriendItem';
import s from './FriendList.scss';

const query = gql`query getUserFriends($userId: String!) {
  user(_id: $userId) {
    _id,
    friends {
      _id
      fullName
      totalFriends
      isFriend
      profile {
        picture
        firstName
        lastName
      }
    }
  },
}`;

class FriendList extends Component {

  render() {
    const { user } = this.props;
    const { loading } = this.props;

    if (loading) {
      return <Loading show={loading} full>Đang tải ...</Loading>;
    }

    return (
      <div className={classNames(s.container)}>
        <Row>
          <Col md={12}>
            { ((user && user.friends) || []).map(friend => (
              <FriendItem key={Math.random()} friend={friend} />
            )) }
          </Col>
        </Row>
      </div>
    );
  }
}

FriendList.propTypes = {
  loading: PropTypes.bool.isRequired,
  user: PropTypes.object,
};

export default compose(
  withStyles(s),
  connect(state => ({
    user: state.user,
  })),
  graphql(query, {
    options: ownProps => ({
      variables: {
        userId: ownProps.userId,
      },
    }),
    props: ({ data }) => {
      if (!data.user) {
        return {
          loading: data.loading,
        };
      }

      const { user } = data;
      return {
        user,
        loading: data.loading,
      };
    },
  }),
)(FriendList);
