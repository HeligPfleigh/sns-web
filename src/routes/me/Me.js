import React, { PropTypes } from 'react';

import { Grid, Row, Col, Image } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import update from 'immutability-helper';
import s from './Me.scss';
import Tab from '../../components/Me/TabComponent/Tab';
import Info from '../../components/Me/InfoComponent/Info';
import NewPost from '../../components/NewPost';
import imageSrc from './Awesome-Art-Landscape-Wallpaper.jpg';
import Feed from '../home/Feed';
import { MY_TIME_LINE, MY_INFO } from '../../constants';

const userFragment = gql`
  fragment UserView on UserSchemas {
    _id,
    username,
    profile {
      picture,
      firstName,
      lastName,
      gender,
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

const createNewPost = gql`mutation createNewPost ($message: String!) {
  createNewPost(message: $message) {
    ...PostView
  }
}
${postFragment}`;

const profilePageQuery = gql`query me {
  me {
    ...UserView,
    posts {
      ...PostView
    }
  },
}
${userFragment}
${postFragment}
`;

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

const createNewCommentQuery = gql`
  mutation createNewComment (
    $postId: String!,
    $message: String!,
    $commentId: String,
  ) {
    createNewComment(
      postId: $postId,
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

class Me extends React.Component {

  static propTypes = {
    data: PropTypes.shape({
      me: PropTypes.shape({
        posts: PropTypes.arrayOf(PropTypes.object).isRequired,
        profile: PropTypes.shape({
          picture: PropTypes.string.isRequired,
          firstName: PropTypes.string.isRequired,
          lastName: PropTypes.string.isRequired,
        }).isRequired,
      }).isRequired,
    }).isRequired,
    createNewComment: PropTypes.func.isRequired,
    createNewPost: PropTypes.func.isRequired,
    likePost: PropTypes.func.isRequired,
    unlikePost: PropTypes.func.isRequired,
    query: PropTypes.shape({
      tab: PropTypes.string.isRequired,
    }),
  };

  render() {
    debugger;
    const { data: { me }, query, createNewComment } = this.props;
    const posts = me ? me.posts : [];
    const avatar = me && me.profile && me.profile.picture;
    const profile = me && me.profile;
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
                  { profile && (<h1> {profile.lastName} {profile.firstName}</h1>) }
                </div>
              </div>
              <div className={s.infors}>
                <Tab numbers={numbers} stateChildShow={tab} isMe />
              </div>
              <Grid fluid>
                <div className={tab === MY_TIME_LINE ? s.active : s.inactive}>
                  <div className={s.parent}>
                    <NewPost createNewPost={this.props.createNewPost} />
                  </div>
                  { posts.map(data => (
                    <Feed
                      key={data._id}
                      data={data}
                      userInfo={me}
                      likePostEvent={this.props.likePost}
                      unlikePostEvent={this.props.unlikePost}
                      createNewComment={createNewComment}
                    />
                ))}
                </div>
                <div className={tab === MY_INFO ? s.active : s.inactive}>
                  {profile && <Info profile={profile} isMe />}
                </div>
              </Grid>
            </div>
          </Col>
          <Col sm={4} xs={12}></Col>
        </Row >
      </Grid>
    );
  }
}

export default compose(
  withStyles(s),
  graphql(profilePageQuery, {
    options: () => ({
      variables: {},
    }),
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
              id: ownProps.data.me._id,
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
          profilePageQuery: (previousResult, { mutationResult }) => {
            debugger;
            const newPost = mutationResult.data.createNewPost;
            return update(previousResult, {
              me: {
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
          profilePageQuery: (previousResult, { mutationResult }) => {
            const updatedPost = mutationResult.data.likePost;
            const index = previousResult.me.posts.findIndex(item => item._id === updatedPost._id);
            return update(previousResult, {
              me: {
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
          profilePageQuery: (previousResult, { mutationResult }) => {
            const updatedPost = mutationResult.data.unlikePost;
            const index = previousResult.me.posts.findIndex(item => item._id === updatedPost._id);
            return update(previousResult, {
              me: {
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
           homePageQuery: (previousResult, { mutationResult }) => {
             const newComment = mutationResult.data.createNewComment;
             const index = previousResult.feeds.edges.findIndex(item => item._id === postId);
             const currentPost = previousResult.feeds.edges[index];
             let updatedPost = null;
             if (currentPost._id !== postId) {
               return previousResult;
             }
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
                 comments: {
                   $splice: [[indexComment, 1, commentItem]],
                 },
               });
             } else {
               updatedPost = update(currentPost, {
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
)(Me);
