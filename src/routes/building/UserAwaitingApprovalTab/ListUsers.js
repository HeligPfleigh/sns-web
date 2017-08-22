import React, { PropTypes } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import { Panel } from 'react-bootstrap';
import classNames from 'classnames';
import User from './User';
import rejectingUserToBuildingMutation from './rejectingUserToBuildingMutation.graphql';
import approvingUserToBuildingMutation from './approvingUserToBuildingMutation.graphql';
import { openAlertGlobal } from '../../../reducers/alert';
import Errors from '../Errors';
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
    const {
      data: {
        edges,
        pageInfo: {
          hasNextPage,
        },
      },
      loadMore,
    } = this.props;
    if (edges.length === 0) {
      return this.renderNoRecordsFound();
    }
    return (
      <InfiniteScroll
        loadMore={loadMore}
        hasMore={hasNextPage}
        loader={this.renderLoadingIcon()}
      >
        { edges.map(edge => (
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
      <Panel header="Danh sách thành viên của tòa nhà" className={s.usersAwaitingApproval}>
        <Errors
          open
          message={this.state.errorMessage}
          autoHideDuration={4000}
        />
        { loading ? this.renderLoadingIcon() : this.renderListUsers() }
      </Panel>
    );
  }
}

ListUsers.defaultProps = {
  data: {
    edges: [],
    pageInfo: {
      hasNextPage: false,
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
      }),
    }),
  }),
)(connect(
  null,
  { openAlertGlobalAction: openAlertGlobal },
)(ListUsers));
