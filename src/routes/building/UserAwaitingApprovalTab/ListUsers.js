import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroller';
import update from 'immutability-helper';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Panel, Image, Col, Row, Clearfix, ButtonToolbar, ButtonGroup, Button } from 'react-bootstrap';

import s from './UserAwaitingApproval.scss';

const listUsersAwaitingApproval = gql`
  query listUsersAwaitingApproval ($buildingId: String!) {
    building (_id: $buildingId) {
      requests {
        edges {
          _id
          chatId
          isFriend
          createdAt
          updatedAt
        }
      }
    }
  }`;

class ListUsers extends Component {
  render() {
    console.log(this.props);
    return (
      <Panel header="Danh sách thành viên của tòa nhà" className={ s.usersAwaitingApproval }>
        { this.props.loading ? this.__renderLoadingIcon() : this.__renderListUsers() }
      </Panel>
    );
  }

  /**
   * 
   */
  __renderLoadingIcon() {
    return (
      <div className="text-center">
        <i className="fa fa-spinner fa-spin" aria-hidden="true"></i> Đang tải dữ liệu ...
      </div>
    );
  }

  /**
   * 
   */
  __renderListUsers() {
    return (
      <InfiniteScroll
          loadMore={ this.props.loadMore }
          hasMore={ this.props.data.pageInfo.hasNextPage }
          loader={ this.__renderLoadingIcon() }
        >
        xuan
        {/* { this.props.data.edges.map(item => (
          <Row className={ s.item } key={ item }>
            <Col xs={4} md={3}>
              <Image src="https://bootstrap-themes.github.io/application/assets/img/instagram_2.jpg" circle thumbnail responsive />
            </Col>
            <Col xs={8} md={9}>
              <label className={ s.fullName }>Xuan Toc Den</label>
              
              <div className={ s.moreInfo }>
                <div><small><i>Căn hộ số 204, thuộc tòa nhà Hancorp</i></small></div>
                <div><small><i>Số điện thoại: 0989 649 075</i></small></div>
              </div>

              <ButtonToolbar>

                <Button title="Xem thông tin của thành viên" bsStyle="info" bsSize="xsmall">
                  <i className="fa fa-info-circle" /> Xem thông tin
                </Button>

                <ButtonGroup>

                  <Button title="Chấp nhận là thành viên của tòa nhà" bsStyle="primary" bsSize="xsmall">
                    <i className="fa fa-check" /> Đồng ý
                  </Button>

                  <Button title="Không chấp nhận là thành viên của tòa nhà" bsStyle="danger" bsSize="xsmall">
                    <i className="fa fa-remove" /> Từ chối
                  </Button>

                </ButtonGroup>

              </ButtonToolbar>
            </Col>
            <Clearfix />
          </Row>
        )) } */}
      </InfiniteScroll>
    );
  }
}

ListUsers.defaultProps = {
  data: {
    edges: [],
    pageInfo: {
      hasNextPage: false,
    }
  },
  loadMore: () => void(0),
};

ListUsers.PropTypes = {
  data: PropTypes.shape({
    edges: PropTypes.array,
    pageInfo: PropTypes.object,
  }).isRequired,
  loadMore: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.object.isRequired,
};

export default withStyles(s)(ListUsers);
// export default compose(withStyles(s), connect(state => ({
//     user: state.user,
//   })), graphql(listUsersAwaitingApproval, {
//     options: ownProps => ({
//       variables: {
//         // _id: ownProps.data.building._id,
//         buildingId: "58da279f0ff5af8c8be59c36",
//       },
//       fetchPolicy: 'network-only',
//     }),
//     props: ({ ownProps, data }) => {
//       // const { fetchMore } = data;
//       // const loadMoreRows = throttle(() => fetchMore({
//       //   variables: {
//       //     _id: ownProps.building.id,
//       //     cursor: data.resident.posts.pageInfo.endCursor,
//       //   },
//       //   query: morePostsProfilePageQuery,
//       //   updateQuery: (previousResult, { fetchMoreResult }) => {
//       //     const newEdges = fetchMoreResult.resident.posts.edges;
//       //     const pageInfo = fetchMoreResult.resident.posts.pageInfo;
//       //     return update(previousResult, {
//       //       resident: {
//       //         posts: {
//       //           edges: {
//       //             $push: newEdges,
//       //           },
//       //           pageInfo: {
//       //             $set: pageInfo,
//       //           },
//       //         },
//       //       },
//       //     });
//       //   },
//       // }), 300);
      
//       return {
//         data,
//         // loadMoreRows,
//       };
//     },
//   })
// )(ListUsers);
