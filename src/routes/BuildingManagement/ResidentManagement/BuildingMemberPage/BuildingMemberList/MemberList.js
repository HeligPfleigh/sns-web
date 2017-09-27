import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import update from 'immutability-helper';
import throttle from 'lodash/throttle';
import { graphql, compose } from 'react-apollo';
import InfiniteScroll from 'react-infinite-scroller';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import Errors from '../Errors';
import s from './MemberList.scss';
import MemberItem from './MemberItem';
import Loading from '../../../../../components/Loading';
import { openAlertGlobal } from '../../../../../reducers/alert';
import LoadBuildingMembers from '../../../../../graphqls/queries/LoadBuildingMembers.graphql';
import rejectingUserToBuildingMutation from '../graphql/rejectingUserToBuildingMutation.graphql';

class MemberList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      errorMessage: undefined,
      submitting: false,
    };
  }

  rejectUser = (requestsToJoinBuildingId, message) => {
    this.setState({
      submitting: true,
    });

    const {
      rejectingUserToBuilding,
      openAlertGlobalAction,
    } = this.props;
    rejectingUserToBuilding(requestsToJoinBuildingId, message)
    .then(() => {
      openAlertGlobalAction({
        message: 'Bạn đã hủy yêu cầu của user thành công',
        open: true,
        autoHideDuration: 0,
      });
      this.setState({
        submitting: false,
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
      Hiện tại chưa có cư dân của tòa nhà
    </div>
  )

  renderListUsers = () => {
    const { submitting } = this.state;
    const { loading, data, loadMore } = this.props;

    if (loading) {
      return <Loading show={data.loading} full>Đang tải ...</Loading>;
    }

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
        {
          submitting &&
          <Loading show={submitting} full className={s.loading}>
            <span>Thao tác đang được xử lý ...</span>
          </Loading>
        }
        { dataSource.map(edge => (
          <MemberItem
            data={edge}
            key={Math.random()}
            onCancel={this.rejectUser}
          />
        ))}
      </InfiniteScroll>
    );
  }

  render() {
    const { loading } = this.props;
    const { errorMessage } = this.state;
    return (
      <div className={s.container}>
        { errorMessage && <Errors
          open
          autoHideDuration={4000}
          message={this.state.errorMessage}
        /> }
        { loading ? this.renderLoadingIcon() : this.renderListUsers() }
      </div>
    );
  }
}

MemberList.defaultProps = {
  building: {
    requests: {
      edges: [],
      pageInfo: {
        hasNextPage: false,
      },
    },
  },
};

MemberList.propTypes = {
  data: PropTypes.any,
  loadMore: PropTypes.func,
  loading: PropTypes.bool,
  openAlertGlobalAction: PropTypes.func,
  rejectingUserToBuilding: PropTypes.func,
};

export default compose(
  withStyles(s),
  graphql(LoadBuildingMembers, {
    options: props => ({
      variables: {
        buildingId: props.buildingId,
        limit: 4,
      },
      fetchPolicy: 'network-only',
    }),
    props: ({ data }) => {
      const { loading, building, fetchMore } = data;
      const loadMore = throttle(() => fetchMore({
        query: LoadBuildingMembers,
        variables: {
          buildingId: data.building._id,
          cursor: data.building.members.pageInfo.endCursor,
          limit: 4,
        },
        fetchPolicy: 'network-only',
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return null;
          }
          return update(previousResult, {
            building: {
              members: {
                edges: {
                  $push: fetchMoreResult.building.members.edges,
                },
                pageInfo: {
                  $set: fetchMoreResult.building.members.pageInfo,
                },
              },
            },
          });
        },
      }), 300);

      return {
        loading,
        loadMore,
        data: building && building.members,
      };
    },
  }),
  graphql(rejectingUserToBuildingMutation, {
    props: ({ mutate }) => ({
      rejectingUserToBuilding: (id, message) => mutate({
        variables: {
          input: {
            message,
            requestsToJoinBuildingId: id,
          },
        },
        updateQueries: {
          LoadBuildingMembers: (previousResult, { mutationResult }) => {
            const request = mutationResult.data.rejectingUserToBuilding.request;
            return update(previousResult, {
              building: {
                members: {
                  edges: {
                    $unset: [request._id],
                  },
                },
              },
            });
          },
        },
      }),
    }),
  }),
)(connect(
  null,
  { openAlertGlobalAction: openAlertGlobal },
)(MemberList));
