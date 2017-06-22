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
import { PUBLIC } from '../../constants';
import FriendList, { Friend } from './FriendList';
import Errors from './Errors';
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
      requests {
        _id
        profile {
          picture
          firstName
          lastName
        }
      }
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

const createNewPostOnBuildingMutation = gql`mutation createNewPostOnBuilding ($message: String!, $buildingId: String!) {
  createNewPostOnBuilding(message: $message, buildingId: $buildingId) {
    ...PostView
  }
}
${Feed.fragments.post}
`;

const acceptRequestForJoiningBuildingMutation = gql`mutation acceptRequestForJoiningBuilding ($buildingId: String!, $userId: String!) {
  acceptRequestForJoiningBuilding(buildingId: $buildingId, userId: $userId) {
    _id
  }
}
`;

const rejectRequestForJoiningBuildingMutation = gql`mutation rejectRequestForJoiningBuilding ($buildingId: String!, $userId: String!) {
  rejectRequestForJoiningBuilding(buildingId: $buildingId, userId: $userId) {
    _id
  }
}
`;

class Building extends Component {

  constructor(props) {
    super(props);
    this.state = {
      errorMessage: '',
    };
  }

  accept = friend => (evt) => {
    evt.preventDefault();
    this.props.acceptRequestForJoiningBuilding(friend).catch((error) => {
      this.setState({
        errorMessage: error.message,
      });
    });
  }

  cancel = friend => (evt) => {
    evt.preventDefault();
    this.props.rejectRequestForJoiningBuilding(friend).catch((error) => {
      this.setState({
        errorMessage: error.message,
      });
    });
  }

  render() {
    const {
      data: { building, me },
      likePost,
      unlikePost,
      createNewComment,
      loadMoreComments,
      createNewPostOnBuilding,
    } = this.props;
    return (
      <Grid>
        <Row>
          <Col sm={8} xs={12}>
            <Tabs defaultActiveKey={1} animation={false} id="noanim-tab-example">
              <Tab eventKey={1} title="Posts">
                <NewPost createNewPost={createNewPostOnBuilding} privacy={[PUBLIC]} />
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
                </div>
                }
              </Tab>
              { building && building.isAdmin && <Tab eventKey={3} title="Requests">
                <FriendList>
                  <Errors
                    open
                    message={this.state.errorMessage}
                    autoHideDuration={4000}
                  />
                  {
                    building && building.requests.length === 0 && <h3>
                      you don't have any joining requests
                    </h3>
                  }
                  {
                    building && building.requests.length > 0 && building.requests.map(friend =>
                      <Friend key={friend._id} friend={friend} onAccept={this.accept(friend)} onCancel={this.cancel(friend)} />,
                    )
                  }
                </FriendList>
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
  acceptRequestForJoiningBuilding: PropTypes.func.isRequired,
  rejectRequestForJoiningBuilding: PropTypes.func.isRequired,
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
  graphql(createNewPostOnBuildingMutation, {
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
            user: null,
            author: {
              __typename: 'Author',
              _id: ownProps.data.me._id,
              username: ownProps.data.me.username,
              profile: ownProps.data.me.profile,
            },
            building: {
              _id: ownProps.data.building._id,
              name: ownProps.data.building.name,
            },
            privacy: PUBLIC,
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
    props: ({ ownProps, mutate }) => ({
      likePost: (postId, message, totalLikes, totalComments) => mutate({
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
  graphql(acceptRequestForJoiningBuildingMutation, {
    props: ({ ownProps, mutate }) => ({
      acceptRequestForJoiningBuilding: data => mutate({
        variables: {
          buildingId: ownProps.buildingId,
          userId: data._id,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          acceptRequestForJoiningBuilding: {
            __typename: 'Friend',
            _id: data._id,
          },
        },
        updateQueries: {
          loadBuildingQuery: (previousResult, { mutationResult }) => {
            const r = mutationResult.data.acceptRequestForJoiningBuilding;
            return update(previousResult, {
              building: {
                requests: {
                  $unset: [r._id],
                },
              },
            });
          },
        },
      }),
    }),
  }),
  graphql(rejectRequestForJoiningBuildingMutation, {
    props: ({ ownProps, mutate }) => ({
      rejectRequestForJoiningBuilding: data => mutate({
        variables: {
          buildingId: ownProps.buildingId,
          userId: data._id,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          rejectRequestForJoiningBuilding: {
            __typename: 'Friend',
            _id: data._id,
          },
        },
        updateQueries: {
          loadBuildingQuery: (previousResult, { mutationResult }) => {
            const r = mutationResult.data.rejectRequestForJoiningBuilding;
            return update(previousResult, {
              building: {
                requests: {
                  $unset: [r._id],
                },
              },
            });
          },
        },
      }),
    }),
  }),
)(Building);
