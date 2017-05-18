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

import { MY_TIME_LINE, MY_INFO } from '../../constants';
import s from './User.scss';

const profilePageQuery = gql`query profilePageQuery($_id: String!) {
  user(_id : $_id){
    ...UserView,
    posts {
      ...PostView
    }
  }
  me {
    ...UserView,
  }
}
${Feed.fragments.user}
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
                  { profile && (<h1> {profile.lastName} {profile.firstName}</h1>) }
                </div>
              </div>
              <div className={s.infors}>
                <Tab numbers={numbers} stateChildShow={tab} isMe={false} id={id} />
              </div>
              <Grid fluid>
                <div className={tab === MY_TIME_LINE ? s.active : s.inactive}>
                  <div className={s.parent}>
                    { me && user && <NewPost createNewPost={this.props.createNewPost} friend={user} /> }
                  </div>
                  { me && posts && <FeedList
                    feeds={posts}
                    likePostEvent={this.props.likePost}
                    unlikePostEvent={this.props.unlikePost}
                    userInfo={me}
                    loadMoreComments={this.props.loadMoreComments}
                    createNewComment={this.props.createNewComment}
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
  query: PropTypes.object.isRequired,
};

User.defaultProps = {
  data: [],
  id: '',
  query: {},
};

export default compose(
  withStyles(s),
  graphql(profilePageQuery, {
    options: props => ({
      variables: { _id: props.id },
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
  graphql(Feed.mutation.createNewPost, {
    props: ({ ownProps, mutate }) => ({
      createNewPost: (message, friend) => mutate({
        variables: { message, userId: friend._id },
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
              totalNotification: 0,
            },
            author: {
              __typename: 'UserSchemas',
              _id: ownProps.data.me._id,
              username: ownProps.data.me.username,
              profile: ownProps.data.me.profile,
              totalNotification: 0,
            },
            comments: [],
            createdAt: (new Date()).toString(),
            totalLikes: 0,
            totalComments: 0,
            isLiked: false,
          },
        },
        updateQueries: {
          profilePageQuery: (previousResult, { mutationResult }) => {
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
            const index = previousResult.user.posts.findIndex(item => item._id === updatedPost._id);
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
            const index = previousResult.user.posts.findIndex(item => item._id === updatedPost._id);
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
          profilePageQuery: (previousResult, { mutationResult }) => {
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
