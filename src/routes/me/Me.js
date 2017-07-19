import React, { PropTypes } from 'react';
import pick from 'lodash/pick';
import { Grid, Row, Col, Image } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import update from 'immutability-helper';
import { generate as idRandom } from 'shortid';
import CommentList from '../../components/Comments/CommentList';
import s from './Me.scss';
import Tab from '../../components/Me/TabComponent/Tab';
import Info from '../../components/Me/InfoComponent/Info';
import InfoUpdate from '../../components/Me/InfoComponent/InfoUpdate';
import NewPost from '../../components/NewPost';
import imageSrc from './Awesome-Art-Landscape-Wallpaper.jpg';
import FeedList, { Feed } from '../../components/Feed';
import { MY_TIME_LINE, MY_INFO } from '../../constants';

const profilePageQuery = gql`query profilePageQuery {
  me {
    _id,
    username,
    profile {
      picture,
      firstName,
      lastName,
      gender
    }
    posts {
      ...PostView
    }
  },
}
${Feed.fragments.post}
`;

const updateProfileQuery = gql`mutation updateProfile ($profile: ProfileInput!) {
  updateProfile (profile: $profile) {
    _id
    username
    profile {
      picture
      firstName
      lastName
      gender
    }
  }
}`;

class Me extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isInfoUpdate: false,
    };
  }

  openInfoUpdate = () => {
    this.setState({
      isInfoUpdate: true,
    });
  }

  closeInfoUpdate = () => {
    this.setState({
      isInfoUpdate: false,
    });
  }

  handleUpdate = (values) => {
    const profile = pick(values, ['firstName', 'lastName', 'gender', 'picture']);
    this.props.updateProfile({
      variables: { profile },
    }).then(res => console.log(res)).catch(err => console.log(err));
    this.closeInfoUpdate();
  }

  render() {
    const { data: { me }, query, createNewComment, loadMoreComments, editPost } = this.props;
    const avatar = (me && me.profile && me.profile.picture) || '';
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
                  {profile && (<h1> {profile.lastName} {profile.firstName}</h1>)}
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
                  { me && me.posts && <FeedList
                    feeds={me ? me.posts : []}
                    likePostEvent={this.props.likePost}
                    unlikePostEvent={this.props.unlikePost}
                    userInfo={me}
                    loadMoreComments={loadMoreComments}
                    createNewComment={createNewComment}
                    deletePost={this.props.deletePost}
                    editPost={editPost}
                  />}
                </div>
                <div className={tab === MY_INFO ? s.active : s.inactive}>
                  {profile &&
                    (this.state.isInfoUpdate ?
                      <InfoUpdate initialValues={profile} profile={profile} closeInfoUpdate={this.closeInfoUpdate} onSubmit={this.handleUpdate} />
                      : <Info profile={profile} isMe openInfoUpdate={this.openInfoUpdate} />)}
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

Me.propTypes = {
  data: PropTypes.shape({
    me: PropTypes.shape({
      posts: PropTypes.arrayOf(PropTypes.object).isRequired,
      profile: PropTypes.shape({
        picture: PropTypes.string.isRequired,
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
      }).isRequired,
    }),
  }).isRequired,
  createNewComment: PropTypes.func.isRequired,
  createNewPost: PropTypes.func.isRequired,
  updateProfile: PropTypes.func.isRequired,
  likePost: PropTypes.func.isRequired,
  unlikePost: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  loadMoreComments: PropTypes.func.isRequired,
  query: PropTypes.shape({
    tab: PropTypes.string,
  }),
  editPost: PropTypes.func.isRequired,
};

Me.defaultProps = {
  data: [],
};

export default compose(
  withStyles(s),
  graphql(profilePageQuery, {
    options: () => ({
      variables: {},
      fetchPolicy: 'network-only',
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
          const index = previousResult.me.posts.findIndex(item => item._id === fetchMoreResult.post._id);

          const updatedPost = update(previousResult.me.posts[index], {
            comments: {
              $push: fetchMoreResult.post.comments,
            },
          });
          return update(previousResult, {
            me: {
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
      createNewPost: (message, privacy) => mutate({
        variables: { message, privacy },
        optimisticResponse: {
          __typename: 'Mutation',
          createNewPost: {
            __typename: 'Post',
            _id: idRandom(),
            message,
            user: {
              __typename: 'UserSchemas',
              _id: ownProps.data.me._id,
              username: ownProps.data.me.username,
              profile: ownProps.data.me.profile,
            },
            author: {
              __typename: 'UserSchemas',
              _id: ownProps.data.me._id,
              username: ownProps.data.me.username,
              profile: ownProps.data.me.profile,
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
        update: (store, { data: { createNewPost } }) => {
          // Read the data from our cache for this query.
          let data = store.readQuery({ query: profilePageQuery });
          data = update(data, {
            me: {
              posts: {
                $unshift: [createNewPost],
              },
            },
          });
          // Write our data back to the cache.
          store.writeQuery({ query: profilePageQuery, data });
        },
      }),
    }),
  }),
  graphql(Feed.mutation.editPost, {
    props: ({ mutate }) => ({
      editPost: (postId, message) => mutate({
        variables: { postId, message },
        optimisticResponse: {
          __typename: 'Mutation',
          editPost: {
            __typename: 'Post',
            _id: postId,
            message,
          },
        },
        update: (store, { data: { editPost } }) => {
          // Read the data from our cache for this query.
          let data = store.readQuery({ query: profilePageQuery });
          const newMessage = editPost.message;
          const index = data.me.posts.findIndex(item => item._id === postId);
          const currentPost = data.me.posts[index];
          const updatedPost = Object.assign({}, currentPost, {
            message: newMessage,
          });
          data = update(data, {
            me: {
              posts: {
                $splice: [[index, 1, updatedPost]],
              },
            },
          });
          // Write our data back to the cache.
          store.writeQuery({ query: profilePageQuery, data });
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
  graphql(Feed.mutation.unlikePost, {
    props: ({ ownProps, mutate }) => ({
      unlikePost: (postId, message, totalLikes, totalComments) => mutate({
        variables: { postId },
        optimisticResponse: {
          __typename: 'Mutation',
          unlikePost: {
            __typename: 'PostSchemas',
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
  graphql(Feed.mutation.deletePost, {
    props: ({ mutate }) => ({
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
          let data = store.readQuery({ query: profilePageQuery });
          data = update(data, {
            me: {
              posts: {
                $unset: [deletePost._id],
              },
            },
          });
          // Write our data back to the cache.
          store.writeQuery({ query: profilePageQuery, data });
        },
      //   updateQueries: {
      //     profilePageQuery: (previousResult, { mutationResult }) => {
      //       const post = mutationResult.data.deletePost;
      //       return update(previousResult, {
      //         me: {
      //           posts: {
      //             $unset: [post._id],
      //           },
      //         },
      //       });
      //     },
      //   },
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
          profilePageQuery: (previousResult, { mutationResult }) => {
            const newComment = mutationResult.data.createNewComment;
            const index = previousResult.me.posts.findIndex(item => item._id === postId);
            const currentPost = previousResult.me.posts[index];

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

  graphql(updateProfileQuery, {
    name: 'updateProfile',
  }),
)(Me);
