import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import FriendsList from '../../components/FriendsList';
import Label from '../../components/Friend/Label';
import buildingNotificationQuery from './buildingNotificationQuery.graphql';
import s from './BuildingNotification.scss';

class BuildingNotification extends Component {
  render() {
    const { data: { loading } } = this.props;
    console.log(this.props, 'this.props');
    return (
      <div>
        {loading && <h1 style={{ textAlign: 'center' }}>Đang tải dữ liệu</h1>}
        {!loading && <FriendsList>
          <li style={{ paddingLeft: '10px' }}>
            <Label label="Thông báo" />
          </li>
        </FriendsList>
        }
      </div>
    );
  }
}

BuildingNotification.propTypes = {
  data: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
  }).isRequired,
};

export default compose(
  withStyles(s),
  connect(state => ({
    user: state.user,
  })),
  graphql(buildingNotificationQuery, {
    options: ownProps => ({
      variables: {
        _id: ownProps.user.id,
        cursor: null,
      },
      fetchPolicy: 'network-only',
    }),
  }),
)(BuildingNotification);
