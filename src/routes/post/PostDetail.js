import React, { Component, PropTypes } from 'react';
import { graphql, compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Grid, Row, Col } from 'react-bootstrap';
import gql from 'graphql-tag';
import update from 'immutability-helper';
import MediaQuery from 'react-responsive';
import Post from '../../components/Post';
import FriendSuggestions from '../../components/FriendSuggestions';
import Loading from '../../components/Loading';
import s from './PostDetail.scss';

const userFragment = gql`
  fragment frmUserView on UserSchemas {
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
  fragment frmPostView on PostSchemas {
    _id,
    message,
    user {
      ...frmUserView,
    },
    totalLikes,
    totalComments,
    isLiked,
    createdAt,
  }
  ${userFragment}
`;

const commentFragment = gql`fragment frmCommentView on CommentSchemas {
    _id,
    message,
    user {
      ...frmUserView
    },
    parent,
    updatedAt,
  }
  ${userFragment}
`;

const PostDetailQuery = gql`query PostDetailQuery ($postId: String) {
  post (_id: $postId) {
    ...frmPostView
    comments {
      _id
      message
      user {
        ...frmUserView,
      },
      parent,
      reply {
        ...frmCommentView
      },
      updatedAt,
    }
  }
  me {
    ...frmUserView,
  },
}
${postFragment}
${userFragment}
${commentFragment}`;

const likePostQuery = gql`mutation likePost ($postId: String!) {
  likePost(postId: $postId) {
    ...frmPostView
  }
}
${postFragment}`;

const unlikePostQuery = gql`mutation unlikePost ($postId: String!) {
  unlikePost(postId: $postId) {
    ...frmPostView
  }
}
${postFragment}`;

class PostDetail extends Component {
  static propTypes = {
    data: PropTypes.shape({
      feeds: PropTypes.object,
      loading: PropTypes.bool.isRequired,
    }).isRequired,
    likePost: PropTypes.func.isRequired,
    unlikePost: PropTypes.func.isRequired,
  };

  render() {
    const { data: { loading, post, me }, likePost, unlikePost } = this.props;
    // console.log(this.props);
    return (
      <Grid>
        <Loading show={loading} full>Loading ...</Loading>
        <Row className={s.containerTop30}>
          <Col md={8} sm={12} xs={12}>
            { post && <Post
              data={post}
              likePostEvent={likePost}
              unlikePostEvent={unlikePost}
              userInfo={me}
              isTimeLineMe={false}
            />}
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
  graphql(PostDetailQuery, {
    options: props => ({
      variables: {
        ...props,
        postId: props.postId,
      },
    }),
  }),
  graphql(likePostQuery, {
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
)(PostDetail);
