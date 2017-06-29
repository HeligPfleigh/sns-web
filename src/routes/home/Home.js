import React, { Component, PropTypes } from 'react';
import throttle from 'lodash/throttle';
import { graphql, compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Grid, Row, Col } from 'react-bootstrap';
import gql from 'graphql-tag';
import update from 'immutability-helper';
import MediaQuery from 'react-responsive';
import InfiniteScroll from 'react-infinite-scroller';
import { generate as idRandom } from 'shortid';
import FriendSuggestions from '../../components/FriendSuggestions';
import NewPost from '../../components/NewPost';
import CommentList from '../../components/Comments/CommentList';
import FeedList, { Feed } from '../../components/Feed';
import s from './Home.scss';

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
    _id,
    username,
    profile {
      picture,
      firstName,
      lastName
    }
  },
}
${Feed.fragments.post}`;

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
    loadMoreComments: PropTypes.func.isRequired,
    createNewComment: PropTypes.func.isRequired,
  };

  render() {
    // Pre-fetch data
    const { data: { loading, feeds, me }, loadMoreRows, loadMoreComments, createNewComment } = this.props;
    let hasNextPage = false;
    if (!loading && feeds && feeds.pageInfo) {
      hasNextPage = feeds.pageInfo.hasNextPage;
    }
    return (
      <Grid>
        <Row className={s.containerTop30}>
          <Col md={8} sm={12} xs={12}>
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
                loadMoreComments={loadMoreComments}
                createNewComment={createNewComment}
              />}
            </InfiniteScroll>
          </Col>
          <MediaQuery minDeviceWidth={992} values={{ deviceWidth: 1600 }}>
            <Col md={4} smHidden xsHidden>
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
      // pollInterval: 30000,
      fetchPolicy: 'network-only',
    }),
    props: ({ data }) => {
      const { fetchMore } = data;
      const loadMoreRows = throttle(() => fetchMore({
        variables: {
          cursor: data.feeds.pageInfo.endCursor,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newEdges = fetchMoreResult.feeds.edges;
          const pageInfo = fetchMoreResult.feeds.pageInfo;
          return update(previousResult, {
            feeds: {
              edges: {
                $push: newEdges,
              },
              pageInfo: {
                $set: pageInfo,
              },
            },
          });
        },
      }), 300);
      const loadMoreComments = (commentId, postId, limit = 5) => fetchMore({
        variables: {
          commentId,
          limit,
          postId,
        },
        query: CommentList.fragments.loadCommentsQuery,
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const index = previousResult.feeds.edges.findIndex(item => item._id === fetchMoreResult.post._id);

          const updatedPost = update(previousResult.feeds.edges[index], {
            comments: {
              $push: fetchMoreResult.post.comments,
            },
          });
          return update(previousResult, {
            feeds: {
              edges: {
                $splice: [[index, 1, updatedPost]],
              },
            },
          });
        },
      });
      return {
        data,
        loadMoreRows,
        loadMoreComments,
      };
    },
  }),
  graphql(NewPost.mutation.createNewPost, {
    props: ({ ownProps, mutate }) => ({
      createNewPost: (message, privacy) => mutate({
        variables: { message, privacy },
        optimisticResponse: {
          __typename: 'Mutation',
          createNewPost: {
            __typename: 'Post',
            _id: idRandom(),
            message,
            user: {
              __typename: 'Friend',
              _id: ownProps.data.me._id,
              username: ownProps.data.me.username,
              profile: ownProps.data.me.profile,
              // totalNotification: 0,
            },
            author: {
              __typename: 'Author',
              _id: ownProps.data.me._id,
              username: ownProps.data.me.username,
              profile: ownProps.data.me.profile,
              // totalNotification: 0,
            },
            building: null,
            privacy,
            comments: [],
            createdAt: (new Date()).toString(),
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
  graphql(Feed.mutation.likePost, {
    props: ({ ownProps, mutate }) => ({
      likePost: (postId, message, totalLikes, totalComments) => mutate({
        variables: { postId },
        optimisticResponse: {
          __typename: 'Mutation',
          likePost: {
            __typename: 'Post',
            _id: postId,
            message,
            user: {
              __typename: 'Friend',
              _id: ownProps.data.me._id,
              username: ownProps.data.me.username,
              profile: ownProps.data.me.profile,
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
  graphql(Feed.mutation.unlikePost, {
    props: ({ ownProps, mutate }) => ({
      unlikePost: (postId, message, totalLikes, totalComments) => mutate({
        variables: { postId },
        optimisticResponse: {
          __typename: 'Mutation',
          unlikePost: {
            __typename: 'Post',
            _id: postId,
            message,
            user: {
              __typename: 'Friend',
              _id: ownProps.data.me._id,
              username: ownProps.data.me.username,
              profile: ownProps.data.me.profile,
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
  graphql(CommentList.mutation.createNewCommentQuery, {
    props: ({ mutate }) => ({
      createNewComment: (postId, message, commentId, user) => mutate({
        variables: { postId, message, commentId },
        optimisticResponse: {
          __typename: 'Mutation',
          createNewComment: {
            __typename: 'Comment',
            _id: idRandom(),
            message,
            user: {
              __typename: 'Author',
              _id: user._id,
              username: user.username,
              profile: user.profile,
            },
            parent: commentId || null,
            reply: [],
            updatedAt: (new Date()).toString(),
          },
        },
        updateQueries: {
          homePageQuery: (previousResult, { mutationResult }) => {
            const newComment = mutationResult.data.createNewComment;
            const index = previousResult.feeds.edges.findIndex(item => item._id === postId);
            const currentPost = previousResult.feeds.edges[index];
            let updatedPost = null;
            if (currentPost._id !== postId) {
              return previousResult;
            }

            let commentCount = currentPost.totalComments;
            if (commentId) {
              const indexComment = currentPost.comments.findIndex(item => item._id === commentId);
              const commentItem = currentPost.comments[indexComment];
              // init reply value
              if (!commentItem.reply) {
                commentItem.reply = [];
              }

              // push value into property reply
              commentItem.reply.push(newComment);
              updatedPost = update(currentPost, {
                totalComments: { $set: ++commentCount },
                comments: {
                  $splice: [[indexComment, 1, commentItem]],
                },
              });
            } else {
              updatedPost = update(currentPost, {
                totalComments: { $set: ++commentCount },
                comments: {
                  $unshift: [newComment],
                },
              });
            }
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