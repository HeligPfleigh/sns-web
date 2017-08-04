import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Grid, Row, Col, Image } from 'react-bootstrap';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import update from 'immutability-helper';
import { generate as idRandom } from 'shortid';
import Tab from '../../components/Me/TabComponent/Tab';
import Info from '../../components/Me/InfoComponent/Info';
import NewPost from '../../components/NewPost';
import imageSrc from './Awesome-Art-Landscape-Wallpaper.jpg';
import CommentList from '../../components/Comments/CommentList';
import FeedList, { Feed } from '../../components/Feed';
import { PUBLIC, FRIEND, MY_TIME_LINE, MY_INFO } from '../../constants';
import s from './User.scss';

const usersPageQuery = gql`query usersPageQuery($_id: String!) {
  user(_id : $_id){
    _id
    username
    profile {
      picture
      firstName
      lastName
    }
    posts {
      ...PostView
    }
    isFriend
  }
  me {
    _id
    username
    profile {
      picture
      firstName
      lastName
    },
  }
}
${Feed.fragments.post}`;

class User extends Component {

  render() {
    const { data: { user, me }, query, id } = this.props;
    const posts = user ? user.posts : [];
    const avatar = user && user.profile && user.profile.picture;
    const profile = user && user.profile;
    const numbers = 100;
    let tab = MY_TIME_LINE;
    if (query.tab) {
      tab = MY_INFO;
    }

    return (
      <Grid className={s.margintop30}>
        <Row>
          <Col sm={8} xs={12}>
            <div className={s.feedsContent}>
              <div className={s.topLayout}>
                <Image className={s.image} src={imageSrc} />
                <div className={s.userName} >
                  <Image className={s.avartar} src={avatar} />
                  { profile && (<h1>{profile.firstName} {profile.lastName}</h1>) }
                </div>
              </div>
              <div className={s.infors}>
                <Tab numbers={numbers} stateChildShow={tab} isMe={false} id={id} />
              </div>
              <Grid fluid>
                <div className={tab === MY_TIME_LINE ? s.active : s.inactive}>
                  <div className={s.parent}>
                    { me && user && user.isFriend && <NewPost
                      createNewPost={this.props.createNewPost} friend={user}
                      privacy={[
                        {
                          name: PUBLIC,
                          glyph: 'globe',
                        },
                        {
                          name: FRIEND,
                          glyph: 'user',
                        },
                      ]}
                    /> }
                  </div>
                  { me && posts && <FeedList
                    feeds={posts}
                    likePostEvent={this.props.likePost}
                    unlikePostEvent={this.props.unlikePost}
                    userInfo={me}
                    deletePost={this.props.deletePost}
                    loadMoreComments={this.props.loadMoreComments}
                    createNewComment={this.props.createNewComment}
                    editPost={this.props.editPost}
                    sharingPost={this.props.sharingPost}
                  />}
                </div>
                <div className={tab === MY_INFO ? s.active : s.inactive}>
                  {profile && <Info profile={profile} isMe={false} />}
                </div>
              </Grid>
            </div>
          </Col>
          <Col sm={4} xs={12}></Col>
        </Row>
      </Grid>
    );
  }
}

User.propTypes = {
  data: PropTypes.shape({
    feeds: PropTypes.object,
    loading: PropTypes.bool.isRequired,
  }).isRequired,
  createNewPost: PropTypes.func.isRequired,
  likePost: PropTypes.func.isRequired,
  unlikePost: PropTypes.func.isRequired,
  loadMoreComments: PropTypes.func.isRequired,
  createNewComment: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  deletePost: PropTypes.func.isRequired,
  query: PropTypes.object.isRequired,
  editPost: PropTypes.func.isRequired,
  sharingPost: PropTypes.func.isRequired,
};

User.defaultProps = {
  data: [],
  id: '',
  query: {},
};

export default compose(
  withStyles(s),
  graphql(usersPageQuery, {
    options: props => ({
      variables: { 
        _id: props.id,
        fetchPolicy: 'cache-and-network',
      },
    }),
    props: ({ data }) => {
      if (!data) { 
        return;
      }
      const { fetchMore } = data;
      const loadMoreComments = (commentId, postId, limit = 5) => fetchMore({
        variables: {
          commentId,
          limit,
          postId,
        },
        query: CommentList.fragments.loadCommentsQuery,
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const index = previousResult.user.posts.findIndex(item => item._id === fetchMoreResult.post._id);

          const updatedPost = update(previousResult.user.posts[index], {
            comments: {
              $push: fetchMoreResult.post.comments,
            },
          });
          return update(previousResult, {
            user: {
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
  graphql(NewPost.mutation.createNewPost, {
    props: ({ ownProps, mutate }) => ({
      createNewPost: (message, privacy, photos, friend) => mutate({
        variables: { message, privacy, photos, userId: friend._id },
        optimisticResponse: {
          __typename: 'Mutation',
          createNewPost: {
            __typename: 'PostSchemas',
            _id: idRandom(),
            message,
            user: {
              __typename: 'UserSchemas',
              _id: friend._id,
              username: friend.username,
              profile: friend.profile,
            },
            author: {
              __typename: 'UserSchemas',
              _id: ownProps.data.me._id,
              username: ownProps.data.me.username,
              profile: ownProps.data.me.profile,
            },
            privacy,
            building: null,
            sharing: null,
            comments: [],
            photos,
            createdAt: (new Date()).toString(),
            totalLikes: 0,
            totalComments: 0,
            isLiked: false,
          },
        },
        updateQueries: {
          usersPageQuery: (previousResult, { mutationResult }) => {
            const newPost = mutationResult.data.createNewPost;
            return update(previousResult, {
              user: {
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
      likePost: (postId, message, totalLikes) => mutate({
        variables: { postId },
        optimisticResponse: {
          __typename: 'Mutation',
          likePost: {
            __typename: 'PostSchemas',
            _id: postId,
          },
        },
        updateQueries: {
          usersPageQuery: (previousResult, { mutationResult }) => {
            let updatedPost = mutationResult.data.likePost;
            const index = previousResult.user.posts.findIndex(item => item._id === updatedPost._id);
            updatedPost = Object.assign({}, previousResult.user.posts[index], {
              totalLikes: totalLikes + 1,
              isLiked: true,
            });
            return update(previousResult, {
              user: {
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
      unlikePost: (postId, message, totalLikes) => mutate({
        variables: { postId },
        optimisticResponse: {
          __typename: 'Mutation',
          unlikePost: {
            __typename: 'PostSchemas',
            _id: postId,
          },
        },
        updateQueries: {
          usersPageQuery: (previousResult, { mutationResult }) => {
            let updatedPost = mutationResult.data.unlikePost;
            const index = previousResult.user.posts.findIndex(item => item._id === updatedPost._id);
            updatedPost = Object.assign({}, previousResult.user.posts[index], {
              totalLikes: totalLikes - 1,
              isLiked: false,
            });
            return update(previousResult, {
              user: {
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
  graphql(Feed.mutation.sharingPost, {
    props: ({ mutate, ownProps }) => ({
      sharingPost: (postId, privacy, message) => mutate({
        variables: {
          _id: postId,
          privacy: privacy || PUBLIC,
          message,
        },
      }),
      update: (store, { data: { sharingPost } }) => {
      },
    }),
  }),
  graphql(Feed.mutation.editPost, {
    props: ({ mutate }) => ({
      editPost: (post, isDelPostSharing) => mutate({
        variables: {
          postId: post._id,
          message: post.message,
          isDelPostSharing,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          editPost: {
            ...{ __typename: 'Post' },
            ...post,
            ...{ sharing: isDelPostSharing ? post.sharing : null },
          },
        },
      }),
    }),
  }),
  graphql(Feed.mutation.deletePost, {
    props: ({ ownProps, mutate }) => ({
      deletePost: postId => mutate({
        variables: { _id: postId },
        optimisticResponse: {
          __typename: 'Mutation',
          deletePost: {
            __typename: 'Post',
            _id: postId,
          },
        },
        update: (store, { data: { deletePost } }) => {
          // Read the data from our cache for this query.
          let data = store.readQuery({
            query: usersPageQuery,
            variables: {
              _id: ownProps.id,
            },
          });
          data = update(data, {
            user: {
              posts: {
                $unset: [deletePost._id],
              },
            },
          });
          // Write our data back to the cache.
          store.writeQuery({
            query: usersPageQuery,
            variables: {
              _id: ownProps.id,
            },
            data,
          });
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
            __typename: 'CommentSchemas',
            _id: 'TENPORARY_ID_OF_THE_COMMENT_OPTIMISTIC_UI',
            message,
            user: {
              __typename: 'UserSchemas',
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
          usersPageQuery: (previousResult, { mutationResult }) => {
            const newComment = mutationResult.data.createNewComment;
            const index = previousResult.user.posts.findIndex(item => item._id === postId);
            const currentPost = previousResult.user.posts[index];
            let updatedPost = null;
            if (currentPost._id !== postId) {
              return previousResult;
            }

            let commentNum = currentPost.totalComments;
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
                totalComments: { $set: ++commentNum },
                comments: {
                  $splice: [[indexComment, 1, commentItem]],
                },
              });
            } else {
              updatedPost = update(currentPost, {
                totalComments: { $set: ++commentNum },
                comments: {
                  $unshift: [newComment],
                },
              });
            }

            return update(previousResult, {
              user: {
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
)(User);
