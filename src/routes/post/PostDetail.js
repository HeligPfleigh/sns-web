import React, { Component, PropTypes } from 'react';
import { graphql, compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Grid, Row, Col } from 'react-bootstrap';
import gql from 'graphql-tag';
import update from 'immutability-helper';
import MediaQuery from 'react-responsive';
import FriendSuggestions from '../../components/FriendSuggestions';
import Loading from '../../components/Loading';
import FeedList, { Feed } from '../../components/Feed';

import s from './PostDetail.scss';

const PostDetailQuery = gql`query PostDetailQuery ($postId: String!) {
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

const likePostQuery = gql`mutation likePost ($postId: String!) {
  likePost(_id: $postId) {
    ...PostView
  }
}
${Feed.fragments.post}`;

const unlikePostQuery = gql`mutation unlikePost ($postId: String!) {
  unlikePost(_id: $postId) {
    ...PostView
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
      loadMoreComments,
      createNewComment,
    } = this.props;
    return (
      <span>
        {
          post &&
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
                  // deletePost={deletePost}
                  // editPost={editPost}
                  // sharingPost={sharingPost}
                />}
              </Col>
              <MediaQuery minDeviceWidth={992} values={{ deviceWidth: 1600 }}>
                <Col md={4} smHidden xsHidden>
                  <FriendSuggestions />
                </Col>
              </MediaQuery>
            </Row>
          </Grid>
        }
      </span>
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
};

export default compose(
  withStyles(s),
  graphql(PostDetailQuery, {
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
  graphql(likePostQuery, {
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
          PostDetailQuery: (previousResult, { mutationResult }) => {
            const updatedPost = mutationResult.data.likePost;
            return update(previousResult, {
              post: { $set: updatedPost },
            });
          },
        },
      }),
    }),
  }),
  graphql(unlikePostQuery, {
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
          PostDetailQuery: (previousResult, { mutationResult }) => {
            const updatedPost = mutationResult.data.unlikePost;
            return update(previousResult, {
              post: { $set: updatedPost },
            });
          },
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
          PostDetailQuery: (previousResult, { mutationResult }) => {
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
