import React, { PropTypes } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import { Panel } from 'react-bootstrap';
import classNames from 'classnames';

import User from './User';
import Errors from '../Errors';
import { openAlertGlobal } from '../../../../../reducers/alert';
import { ACCEPTED, REJECTED, MEMBER } from '../../../../../constants';
import rejectingUserToBuildingMutation from './graphql/rejectingUserToBuildingMutation.graphql';
import approvingUserToBuildingMutation from './graphql/approvingUserToBuildingMutation.graphql';
import s from './UserAwaitingApproval.scss';

class ListUsers extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      errorMessage: '',
    };
  }

  acceptUser = (evt, requestsToJoinBuildingId) => {
    evt.preventDefault();
    const {
      approvingUserToBuilding,
      openAlertGlobalAction,
    } = this.props;
    approvingUserToBuilding(requestsToJoinBuildingId)
    .then(() => {
      openAlertGlobalAction({
        message: 'Bạn đã xác nhận yêu cầu của user thành công',
        open: true,
        autoHideDuration: 0,
      });
    }).catch((error) => {
      this.setState({
        errorMessage: error.message,
      });
    });
  }

  rejectUser = (evt, requestsToJoinBuildingId) => {
    evt.preventDefault();
    const {
      rejectingUserToBuilding,
      openAlertGlobalAction,
    } = this.props;
    rejectingUserToBuilding(requestsToJoinBuildingId)
    .then(() => {
      openAlertGlobalAction({
        message: 'Bạn đã hủy yêu cầu của user thành công',
        open: true,
        autoHideDuration: 0,
      });
    }).catch((error) => {
      this.setState({
        errorMessage: error.message,
      });
    });
  }

  renderLoadingIcon = () => (
    <div className={classNames(s.noRecordsFound, 'text-center')}>
      <i className="fa fa-spinner fa-spin" aria-hidden="true"></i> Đang tải dữ liệu ...
    </div>
  )

  renderNoRecordsFound = () => (
    <div className={classNames(s.noRecordsFound, 'text-center')}>
      Hiện tại chưa có yêu cầu từ cư dân của tòa nhà
    </div>
  )

  renderListUsers = () => {
    const { data, loadMore } = this.props;
    const dataSource = (data && data.edges) || [];
    const hasNextPage = (data && data.pageInfo && data.pageInfo.hasNextPage) || false;

    if (dataSource.length === 0) {
      return this.renderNoRecordsFound();
    }

    return (
      <InfiniteScroll
        loadMore={loadMore}
        hasMore={hasNextPage || false}
        loader={this.renderLoadingIcon()}
      >
        { dataSource.map(edge => (
          <User
            edge={edge}
            onAccept={this.acceptUser}
            onCancel={this.rejectUser}
            key={Math.random()}
          />
        ))}
      </InfiniteScroll>
    );
  }

  render() {
    const { loading } = this.props;
    return (
      <div className={s.usersAwaitingApproval}>
        <Errors
          open
          message={this.state.errorMessage}
          autoHideDuration={4000}
        />
        { loading ? this.renderLoadingIcon() : this.renderListUsers() }
      </div>
    );
  }
}

ListUsers.defaultProps = {
  building: {
    requests: {
      edges: [],
      pageInfo: {
        hasNextPage: false,
      },
    },
  },
};

ListUsers.propTypes = {
  data: PropTypes.shape({
    edges: PropTypes.arrayOf(PropTypes.object),
    pageInfo: PropTypes.object,
  }).isRequired,
  loadMore: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  approvingUserToBuilding: PropTypes.func.isRequired,
  rejectingUserToBuilding: PropTypes.func.isRequired,
  openAlertGlobalAction: PropTypes.func.isRequired,
};

export default compose(
  withStyles(s),
  graphql(approvingUserToBuildingMutation, {
    props: ({ mutate }) => ({
      approvingUserToBuilding: id => mutate({
        variables: {
          input: {
            requestsToJoinBuildingId: id,
          },
        },
        optimisticResponse: {
          __typename: 'Mutation',
          approvingUserToBuilding: {
            __typename: 'ApprovingUserToBuildingPayload',
            request: {
              __typename: 'RequestsToJoinBuilding',
              _id: id,
              type: MEMBER,
              status: ACCEPTED,
            },
          },
        },
      }),
    }),
  }),
  graphql(rejectingUserToBuildingMutation, {
    props: ({ mutate }) => ({
      rejectingUserToBuilding: id => mutate({
        variables: {
          input: {
            requestsToJoinBuildingId: id,
          },
        },
        optimisticResponse: {
          __typename: 'Mutation',
          rejectingUserToBuilding: {
            __typename: 'RejectingUserToBuildingPayload',
            request: {
              __typename: 'RequestsToJoinBuilding',
              _id: id,
              type: MEMBER,
              status: REJECTED,
            },
          },
        },
      }),
    }),
  }),
)(connect(
  null,
  { openAlertGlobalAction: openAlertGlobal },
)(ListUsers));
