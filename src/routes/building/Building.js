import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import gql from 'graphql-tag';
import update from 'immutability-helper';
import { graphql, compose } from 'react-apollo';
import { Grid, Row, Col, Tab, Tabs } from 'react-bootstrap';
import { generate as idRandom } from 'shortid';
import CommentList from '../../components/Comments/CommentList';
import FeedList, { Feed } from '../../components/Feed';
import NewPost from '../../components/NewPost';
import s from './Building.scss';

const loadBuildingQuery = gql`
  query loadBuildingQuery ($buildingId: String!) {
    building (_id: $buildingId) {
      _id
      name
      address {
        country
        city
        state
        street
      }
      posts {
        ...PostView
      }
      isAdmin
    }
    me {
      _id
      username
      profile {
        picture
        firstName
        lastName
      }
    }
  }
${Feed.fragments.post}`;

const createNewPostOnBuilding = gql`mutation createNewPostOnBuilding ($message: String!, $buildingId: String!) {
  createNewPostOnBuilding(message: $message, buildingId: $buildingId) {
    ...PostView
  }
}
${Feed.fragments.post}
`;

class Building extends Component {
  render() {
    const { data: { building, me }, likePost, unlikePost, createNewComment, loadMoreComments, createNewPostOnBuilding } = this.props;
    return (
      <Grid>
        <Row>
          <Col sm={8} xs={12}>
            <Tabs defaultActiveKey={1} animation={false} id="noanim-tab-example">
              <Tab eventKey={1} title="Posts">
                <NewPost createNewPost={createNewPostOnBuilding} />
                { building && building.posts && <FeedList
                  feeds={building ? building.posts : []}
                  likePostEvent={likePost}
                  unlikePostEvent={unlikePost}
                  userInfo={me}
                  loadMoreComments={loadMoreComments}
                  createNewComment={createNewComment}
                />}
              </Tab>
              <Tab eventKey={2} title="Information">
                { building && <div>
                  name: { building.name } <br />
                  address <br />
                  <ul>
                    <li>country: {building.address.country}</li>
                    <li>city: {building.address.city}</li>
                    <li>state: {building.address.state}</li>
                    <li>street: {building.address.street}</li>
                  </ul>
                  new post here <br />
                  if admin show request to join group <br />
                </div>
                }
              </Tab>
              { building && building.isAdmin && <Tab eventKey={3} title="Requests">
              
              </Tab> }
            </Tabs>
          </Col>
          <Col sm={4} xs={12}></Col>
        </Row>
      </Grid>
    );
  }
}

Building.propTypes = {
  data: PropTypes.shape({
    building: PropTypes.shape({
      _id: PropTypes.string.isRequired,
    }),
    loading: PropTypes.bool.isRequired,
  }).isRequired,
  likePost: PropTypes.func.isRequired,
  unlikePost: PropTypes.func.isRequired,
  createNewComment: PropTypes.func.isRequired,
  loadMoreComments: PropTypes.func.isRequired,
  createNewPostOnBuilding: PropTypes.func.isRequired,
  // buildingId: PropTypes.string.isRequired,
};

Building.defaultProps = {
  data: {
    loading: false,
  },
};

export default compose(
  withStyles(s),
  graphql(loadBuildingQuery, {
    options: props => ({
      variables: {
        buildingId: props.buildingId,
      },
      // fetchPolicy: 'cache-and-network', ???
    }),
    props: ({ data }) => {
      const { fetchMore } = data;
      const loadMoreComments = (commentId, postId, limit = 5) => fetchMore({
        variables: {
          commentId,
          limit,
          postId,
        },
        query: CommentList.fragments.loadCommentsQuery,
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) { return previousResult; }
          const index = previousResult.building.posts.findIndex(item => item._id === postId);
          const updatedPost = update(previousResult.building.posts[index], {
            comments: {
              $push: fetchMoreResult.post.comments,
            },
          });
          return update(previousResult, {
            building: {
              posts: {
                $splice: [[index, 1, updatedPost]],
              },
            },
          });
        },
      });
      return {
        data,
        loadMoreComments,
      };
    },
  }),
  graphql(createNewPostOnBuilding, {
    props: ({ ownProps, mutate }) => ({
      createNewPostOnBuilding: message => mutate({
        variables: {
          message,
          buildingId: ownProps.buildingId,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          createNewPostOnBuilding: {
            __typename: 'Post',
            _id: idRandom(),
            message,
            user: {
              __typename: 'Friend',
              _id: ownProps.data.me._id,
              username: ownProps.data.me.username,
              profile: ownProps.data.me.profile,
            },
            author: {
              __typename: 'Author',
              _id: ownProps.data.me._id,
              username: ownProps.data.me.username,
              profile: ownProps.data.me.profile,
            },
            comments: [],
            createdAt: (new Date()).toString(),
            totalLikes: 0,
            totalComments: 0,
            isLiked: false,
          },
        },
        updateQueries: {
          loadBuildingQuery: (previousResult, { mutationResult }) => {
            const newPost = mutationResult.data.createNewPostOnBuilding;
            return update(previousResult, {
              building: {
                posts: {
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
    props: ({ mutate }) => ({
      likePost: (postId, message, totalLikes, totalComments, user) => mutate({
        variables: {
          postId,
        },
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
          loadBuildingQuery: (previousResult, { mutationResult }) => {
            const updatedPost = mutationResult.data.likePost;
            const index = previousResult.building.posts.findIndex(item => item._id === updatedPost._id);
            return update(previousResult, {
              building: {
                posts: {
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
    props: ({ mutate }) => ({
      unlikePost: (postId, message, totalLikes, totalComments, user) => mutate({
        variables: { postId },
        optimisticResponse: {
          __typename: 'Mutation',
          unlikePost: {
            __typename: 'Post',
            _id: postId,
            message,
            user: {
              __typename: 'Friend',
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
          loadBuildingQuery: (previousResult, { mutationResult }) => {
            const updatedPost = mutationResult.data.unlikePost;
            const index = previousResult.building.posts.findIndex(item => item._id === updatedPost._id);
            return update(previousResult, {
              building: {
                posts: {
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
            _id: 'TENPORARY_ID_OF_THE_COMMENT_OPTIMISTIC_UI',
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
          loadBuildingQuery: (previousResult, { mutationResult }) => {
            const newComment = mutationResult.data.createNewComment;
            const index = previousResult.building.posts.findIndex(item => item._id === postId);
            const currentPost = previousResult.building.posts[index];
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
              building: {
                posts: {
                  $splice: [[index, 1, updatedPost]],
                },
              },
            });
          },
        },
      }),
    }),
  }),
)(Building);
