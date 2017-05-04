/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component, PropTypes } from 'react';
import { graphql, compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Grid, Row, Col } from 'react-bootstrap';
import gql from 'graphql-tag';
import update from 'immutability-helper';
import MediaQuery from 'react-responsive';
import InfiniteScroll from 'react-infinite-scroller';
import Post from '../../components/Post';
import FriendSuggestions from '../../components/FriendSuggestions';
import NewPost from '../../components/NewPost';
import Loading from '../../components/Loading';
import s from './Home.scss';

const userFragment = gql`
  fragment UserView on UserSchemas {
    _id,
    username,
    profile {
      picture,
      firstName,
      lastName
    }
  }
`;

const postFragment = gql`
  fragment PostView on PostSchemas {
    _id,
    message,
    user {
      ...UserView,
    },
    totalLikes,
    totalComments,
    isLiked,
    createdAt,
  }
  ${userFragment}
`;

const homePageQuery = gql`query homePageQuery ($cursor: String) {
  feeds (cursor: $cursor) {
    edges {
      ...PostView
    }
    pageInfo {
      endCursor,
      hasNextPage
    }
  }
  me {
    ...UserView,
  },
}
${userFragment}
${postFragment}
`;

const createNewPost = gql`mutation createNewPost ($message: String!) {
  createNewPost(message: $message) {
    ...PostView
  }
}
${postFragment}`;

const likePost = gql`mutation likePost ($postId: String!) {
  likePost(postId: $postId) {
    ...PostView
  }
}
${postFragment}`;

const unlikePost = gql`mutation unlikePost ($postId: String!) {
  unlikePost(postId: $postId) {
    ...PostView
  }
}
${postFragment}`;

const FeedList = ({ feeds, likePostEvent, unlikePostEvent, userInfo }) => (
  <div>
    {feeds.map(item => (
      item.user && item.user.profile && <Post
        key={item._id}
        data={item}
        likePostEvent={likePostEvent}
        unlikePostEvent={unlikePostEvent}
        userInfo={userInfo}
        isTimeLineMe={false}
      />
    ))}
  </div>
);

FeedList.propTypes = {
  feeds: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
    }),
  ).isRequired,
  likePostEvent: PropTypes.func.isRequired,
  unlikePostEvent: PropTypes.func.isRequired,
  userInfo: PropTypes.object.isRequired,
};

class Home extends Component {
  static propTypes = {
    data: PropTypes.shape({
      feeds: PropTypes.object,
      loading: PropTypes.bool.isRequired,
    }).isRequired,
    createNewPost: PropTypes.func.isRequired,
    loadMoreRows: PropTypes.func.isRequired,
    likePost: PropTypes.func.isRequired,
    unlikePost: PropTypes.func.isRequired,
  };

  render() {
    // Pre-fetch data
    const { data: { loading, feeds, me }, loadMoreRows } = this.props;
    let hasNextPage = false;
    if (!loading && feeds && feeds.pageInfo) {
      hasNextPage = feeds.pageInfo.hasNextPage;
    }
    return (
      <Grid>
        <Loading show={loading} full>Loading ...</Loading>
        <Row className={s.containerTop30}>
          <Col sm={8} xs={12}>
            <NewPost createNewPost={this.props.createNewPost} />
            <InfiniteScroll
              loadMore={loadMoreRows}
              hasMore={hasNextPage}
              loader={<div className="loader">Loading ...</div>}
            >
              { feeds && feeds.edges && <FeedList
                feeds={feeds ? feeds.edges : []}
                likePostEvent={this.props.likePost}
                unlikePostEvent={this.props.unlikePost}
                userInfo={me}
              />}
            </InfiniteScroll>
          </Col>

          <MediaQuery minDeviceWidth={992} values={{ deviceWidth: 1600 }}>
            <Col sm={4} xs={12}>
              <FriendSuggestions />
            </Col>
          </MediaQuery>
        </Row>
      </Grid>
    );
  }
}

export default compose(
  withStyles(s),
  graphql(homePageQuery, {
    options: () => ({
      variables: {},
    }),
    props: ({ data }) => {
      const { fetchMore } = data;
      const loadMoreRows = () => fetchMore({
        variables: {
          cursor: data.feeds.pageInfo.endCursor,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newEdges = fetchMoreResult.feeds.edges;
          const pageInfo = fetchMoreResult.feeds.pageInfo;
          return {
            feeds: {
              edges: [...previousResult.feeds.edges, ...newEdges],
              pageInfo,
            },
          };
        },
      });
      return {
        data,
        loadMoreRows,
      };
    },
  }),
  graphql(createNewPost, {
    props: ({ ownProps, mutate }) => ({
      createNewPost: message => mutate({
        variables: { message },
        optimisticResponse: {
          __typename: 'Mutation',
          createNewPost: {
            __typename: 'PostSchemas',
            _id: 'TENPORARY_ID_OF_THE_POST_OPTIMISTIC_UI',
            message,
            user: {
              __typename: 'UserSchemas',
              _id: ownProps.data.me._id,
              username: ownProps.data.me.username,
              profile: ownProps.data.me.profile,
            },
            createdAt: new Date(),
            totalLikes: 0,
            totalComments: 0,
            isLiked: false,
          },
        },
        updateQueries: {
          homePageQuery: (previousResult, { mutationResult }) => {
            const newPost = mutationResult.data.createNewPost;
            return update(previousResult, {
              feeds: {
                edges: {
                  $unshift: [newPost],
                },
              },
            });
          },
        },
      }),
    }),
  }),
  graphql(likePost, {
    props: ({ mutate }) => ({
      likePost: (postId, message, totalLikes, totalComments, user) => mutate({
        variables: { postId },
        optimisticResponse: {
          __typename: 'Mutation',
          likePost: {
            __typename: 'PostSchemas',
            _id: postId,
            message,
            user: {
              __typename: 'UserSchemas',
              _id: user._id,
              username: user.username,
              profile: user.profile,
            },
            totalLikes: totalLikes + 1,
            totalComments,
            isLiked: true,
          },
        },
        updateQueries: {
          homePageQuery: (previousResult, { mutationResult }) => {
            const updatedPost = mutationResult.data.likePost;
            const index = previousResult.feeds.edges.findIndex(item => item._id === updatedPost._id);
            return update(previousResult, {
              feeds: {
                edges: {
                  $splice: [[index, 1, updatedPost]],
                },
              },
            });
          },
        },
      }),
    }),
  }),
  graphql(unlikePost, {
    props: ({ mutate }) => ({
      unlikePost: (postId, message, totalLikes, totalComments, user) => mutate({
        variables: { postId },
        optimisticResponse: {
          __typename: 'Mutation',
          unlikePost: {
            __typename: 'PostSchemas',
            _id: postId,
            message,
            user: {
              __typename: 'UserSchemas',
              _id: user._id,
              username: user.username,
              profile: user.profile,
            },
            totalLikes: totalLikes - 1,
            totalComments,
            isLiked: false,
          },
        },
        updateQueries: {
          homePageQuery: (previousResult, { mutationResult }) => {
            const updatedPost = mutationResult.data.unlikePost;
            const index = previousResult.feeds.edges.findIndex(item => item._id === updatedPost._id);
            return update(previousResult, {
              feeds: {
                edges: {
                  $splice: [[index, 1, updatedPost]],
                },
              },
            });
          },
        },
      }),
    }),
  }),
)(Home);
