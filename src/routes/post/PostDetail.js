import React, { Component, PropTypes } from 'react';
import { graphql, compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Grid, Row, Col } from 'react-bootstrap';
import gql from 'graphql-tag';
import update from 'immutability-helper';
import MediaQuery from 'react-responsive';
import FriendSuggestions from '../FriendSuggestions';
import Loading from '../../components/Loading';
import history from '../../core/history';
import FeedList, { Feed } from '../../components/Feed';
import likePostMutation from './likePostMutation.graphql';
import unlikePostMutation from './unlikePostMutation.graphql';
import editPostMutation from './editPostMutation.graphql';
import sharingPostMutation from './sharingPostMutation.graphql';
import deletePostMutation from './deletePostMutation.graphql';
import s from './PostDetail.scss';

const postDetailQuery = gql`query postDetailQuery ($postId: String!) {
  post (_id: $postId) {
    ...PostView
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

const loadCommentsQuery = gql`
  query loadCommentsQuery ($postId: String!, $commentId: String, $limit: Int) {
    post (_id: $postId) {
      _id
      comments (_id: $commentId, limit: $limit) {
        _id
        message
        user {
          _id
          username
          profile {
            picture
            firstName
            lastName
          }
        },
        parent,
        reply {
          ...CommentView
        },
        updatedAt,
      }
    }
  }
  ${Feed.fragments.comment}
`;

const createNewCommentQuery = gql`
  mutation createNewComment (
    $postId: String!,
    $message: String!,
    $commentId: String,
  ) {
    createNewComment(
      _id: $postId,
      message: $message,
      commentId: $commentId,
    ) {
      ...CommentView
      reply {
        ...CommentView
      },
    }
  }
${Feed.fragments.comment}`;

class PostDetail extends Component {
  render() {
    const {
      data: {
        loading,
        post,
        me,
      },
      likePost,
      unlikePost,
      editPost,
      loadMoreComments,
      createNewComment,
      sharingPost,
      deletePost,
    } = this.props;
    return (
      <Grid>
        <Loading show={loading} full>Loading ...</Loading>
        <Row className={s.containerTop30}>
          <Col md={8} sm={12} xs={12}>
            { post && <FeedList
              feeds={[post]}
              likePostEvent={likePost}
              unlikePostEvent={unlikePost}
              userInfo={me}
              loadMoreComments={loadMoreComments}
              createNewComment={createNewComment}
              deletePost={deletePost}
              editPost={editPost}
              sharingPost={sharingPost}
            />}
            { !post && <h3>Không tìm thấy bài viết !</h3> }
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

PostDetail.defaultProps = {
  data: {
    post: {
      comments: [],
    },
    loading: false,
  },
};

PostDetail.propTypes = {
  data: PropTypes.shape({
    post: PropTypes.shape({
      comments: PropTypes.array,
    }),
    loading: PropTypes.bool.isRequired,
  }).isRequired,
  likePost: PropTypes.func.isRequired,
  unlikePost: PropTypes.func.isRequired,
  loadMoreComments: PropTypes.func.isRequired,
  createNewComment: PropTypes.func.isRequired,
  editPost: PropTypes.func.isRequired,
  sharingPost: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
};

export default compose(
  withStyles(s),
  graphql(postDetailQuery, {
    options: props => ({
      variables: {
        postId: props.postId,
      },
    }),
    props: ({ data }) => {
      const { fetchMore } = data;
      const loadMoreComments = (commentId, postId, limit = 5) => fetchMore({
        variables: {
          commentId,
          limit,
          postId,
        },
        query: loadCommentsQuery,
        updateQuery: (previousResult, { fetchMoreResult }) => update(previousResult, {
          post: {
            comments: {
              $push: fetchMoreResult.post.comments,
            },
          },
        }),
      });
      return {
        data,
        loadMoreComments,
      };
    },
  }),
  graphql(likePostMutation, {
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
        update: (store) => {
          // Read the data from our cache for this query.
          const data = store.readQuery({
            query: postDetailQuery,
            variables: {
              postId,
            },
          });
          // Do we need create new Object ?
          data.post.totalLikes = totalLikes + 1;
          data.post.isLiked = true;
          store.writeQuery({
            query: postDetailQuery,
            variables: {
              postId,
            },
            data,
          });
        },
      }),
    }),
  }),
  graphql(sharingPostMutation, {
    props: ({ mutate }) => ({
      sharingPost: postId => mutate({
        variables: { _id: postId },
        update: () => {
        // update: (store, { data: { sharingPost } }) => {
          // // Read the data from our cache for this query.
          // setTimeout(() => {
          //   history.push(`/post/${sharingPost._id}`);
          // }, 700);
        },
      }),
    }),
  }),
  graphql(deletePostMutation, {
    props: ({ mutate }) => ({
      deletePost: postId => mutate({
        variables: { _id: postId },
        update: () => {
          // Read the data from our cache for this query.
          setTimeout(() => {
            history.push('/');
          }, 700);
        },
      }),
    }),
  }),
  graphql(unlikePostMutation, {
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
        update: (store) => {
          // Read the data from our cache for this query.
          const data = store.readQuery({
            query: postDetailQuery,
            variables: {
              postId,
            },
          });
          // Do we need create new Object ?
          data.post.totalLikes = totalLikes - 1;
          data.post.isLiked = false;
          store.writeQuery({
            query: postDetailQuery,
            variables: {
              postId,
            },
            data,
          });
        },
      }),
    }),
  }),
  graphql(editPostMutation, {
    props: ({ mutate }) => ({
      editPost: (postId, message, photos) => mutate({
        variables: { postId, message, photos },
        optimisticResponse: {
          __typename: 'Mutation',
          editPost: {
            __typename: 'Post',
            _id: postId,
            message,
            photos,
          },
        },
        update: (store, { data: { editPost } }) => {
          // Read the data from our cache for this query.
          const data = store.readQuery({
            query: postDetailQuery,
            variables: {
              postId,
            },
          });
          // Do we need create new Object ?
          data.post.message = editPost.message;
          data.post.photos = editPost.photos;
          // Write our data back to the cache.
          store.writeQuery({
            query: postDetailQuery,
            variables: {
              postId,
            },
            data,
          });
        },
      }),
    }),
  }),
  graphql(createNewCommentQuery, {
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
          postDetailQuery: (previousResult, { mutationResult }) => {
            const { post } = previousResult;
            const newComment = mutationResult.data.createNewComment;
            let updatedPost = null;
            if (post._id !== postId) {
              return previousResult;
            }
            if (commentId) {
              const indexComment = post.comments.findIndex(item => item._id === commentId);
              const commentItem = post.comments[indexComment];
              // init reply value
              if (!commentItem.reply) {
                commentItem.reply = [];
              }

              // push value into property reply
              commentItem.reply.push(newComment);
              updatedPost = update(previousResult, {
                post: {
                  comments: {
                    $splice: [[indexComment, 1, commentItem]],
                  },
                },
              });
            } else {
              updatedPost = update(previousResult, {
                post: {
                  comments: {
                    $unshift: [newComment],
                  },
                },
              });
            }
            return update(previousResult, { $set: updatedPost });
          },
        },
      }),
    }),
  }),
)(PostDetail);
