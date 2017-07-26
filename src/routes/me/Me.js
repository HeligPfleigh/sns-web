import React, { PropTypes } from 'react';
import pick from 'lodash/pick';
import throttle from 'lodash/throttle';
import { connect } from 'react-redux';
import { Grid, Row, Col, Image } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import InfiniteScroll from 'react-infinite-scroller';
import update from 'immutability-helper';
import { generate as idRandom } from 'shortid';
import CommentList from '../../components/Comments/CommentList';
import Tab from '../../components/Me/TabComponent/Tab';

import Info from '../../components/Me/InfoComponent/Info';
import InfoUpdate from '../../components/Me/InfoComponent/InfoUpdate';
import InfoTab from './InfoTab';

import NewPost from '../../components/NewPost';
import imageSrc from './Awesome-Art-Landscape-Wallpaper.jpg';
import { Feed } from '../../components/Feed';
import FeedList from './FeedList';
import { MY_TIME_LINE, MY_INFO } from '../../constants';
import s from './Me.scss';

const profilePageQuery = gql`query profilePageQuery ($_id: String!, $cursor: String) {
  userTest(_id: $_id) {
    _id,
    username,
    profile {
      picture,
      firstName,
      lastName,
      gender
    }
    posts (cursor: $cursor) {
      pageInfo {
        endCursor
        hasNextPage
        total
        limit
      }
      edges {
        ...PostView
      }
    }
  },
}
${Feed.fragments.post}
`;

const morePostsProfilePageQuery = gql`query morePostsProfilePageQuery ($_id: String!, $cursor: String) {
  userTest(_id: $_id) {
    posts (cursor: $cursor) {
      pageInfo {
        endCursor
        hasNextPage
        total
        limit
      }
      edges {
        ...PostView
      }
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

  updatePostInList = (data, index, post) => (update(data, {
    userTest: {
      posts: {
        edges: {
          $splice: [[index, 1, post]],
        },
      },
    },
  }));

  loadMoreRows = () => {
    const {
      loadMoreRows,
      query,
    } = this.props;
    if (query && query.tab !== MY_INFO) {
      loadMoreRows();
    }
  }

  render() {
    console.log(this.props);
    const {
      data: {
        userTest,
        loading,
      },
      query,
      createNewComment,
      loadMoreComments,
      editPost,
      createNewPost,
      deletePost,
      sharingPost,
    } = this.props;
    const me = userTest;
    const avatar = (me && me.profile && me.profile.picture) || '';
    const profile = me && me.profile;

    const numbers = 100;
    let tab = MY_TIME_LINE;
    if (query.tab) {
      tab = MY_INFO;
    }
    let hasNextPage = false;
    if (!loading && me.posts && me.posts.pageInfo) {
      hasNextPage = me.posts.pageInfo.hasNextPage;
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
                <div className={tab === MY_TIME_LINE ? s.active : s.inactive} style={{ marginTop: '-8px' }}>
                  <div className={s.parent}>
                    <NewPost createNewPost={createNewPost} />
                  </div>
                  <InfiniteScroll
                    loadMore={this.loadMoreRows}
                    hasMore={hasNextPage}
                    loader={<div className="loader">Loading ...</div>}
                  >
                    { me && me.posts && <FeedList
                      feeds={me.posts.edges}
                      userInfo={me}
                      loadMoreComments={loadMoreComments}
                      createNewComment={createNewComment}
                      deletePost={deletePost}
                      editPost={editPost}
                      sharingPost={sharingPost}
                      queryData={profilePageQuery}
                      paramData={{
                        _id: userTest._id,
                        cursor: null,
                      }}
                      updatePost={this.updatePostInList}
                    />}
                  </InfiniteScroll>

                </div>
                <div className={tab === MY_INFO ? s.active : s.inactive}>
                  {profile && <InfoTab
                    userId={me._id}
                    profile={profile}
                    queryData={profilePageQuery}
                    paramData={{
                      _id: userTest._id,
                      cursor: null,
                    }}
                  />}
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
  loadMoreRows: PropTypes.func.isRequired,
  updateProfile: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  loadMoreComments: PropTypes.func.isRequired,
  query: PropTypes.shape({
    tab: PropTypes.string,
  }),
  editPost: PropTypes.func.isRequired,
  sharingPost: PropTypes.func.isRequired,
};

Me.defaultProps = {
  data: [],
};

export default compose(
  withStyles(s),
  connect(state => ({
    user: state.user,
  })),
  graphql(profilePageQuery, {
    options: ownProps => ({
      variables: {
        _id: ownProps.user.id,
        cursor: null,
      },
      fetchPolicy: 'network-only',
    }),
    props: ({ ownProps, data }) => {
      const { fetchMore } = data;
      const loadMoreRows = throttle(() => fetchMore({
        variables: {
          _id: ownProps.user.id,
          cursor: data.userTest.posts.pageInfo.endCursor,
        },
        query: morePostsProfilePageQuery,
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newEdges = fetchMoreResult.userTest.posts.edges;
          const pageInfo = fetchMoreResult.userTest.posts.pageInfo;
          return update(previousResult, {
            userTest: {
              posts: {
                edges: {
                  $push: newEdges,
                },
                pageInfo: {
                  $set: pageInfo,
                },
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
          const index = previousResult.userTest.posts.findIndex(item => item._id === fetchMoreResult.post._id);

          const updatedPost = update(previousResult.userTest.posts[index], {
            comments: {
              $push: fetchMoreResult.post.comments,
            },
          });
          return update(previousResult, {
            userTest: {
              posts: {
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
              __typename: 'UserSchemas',
              _id: ownProps.data.userTest._id,
              username: ownProps.data.userTest.username,
              profile: ownProps.data.userTest.profile,
            },
            author: {
              __typename: 'UserSchemas',
              _id: ownProps.data.userTest._id,
              username: ownProps.data.userTest.username,
              profile: ownProps.data.userTest.profile,
            },
            building: null,
            sharing: null,
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
          let data = store.readQuery({
            query: profilePageQuery,
            variables: {
              _id: ownProps.user.id,
              cursor: null,
            },
          });
          data = update(data, {
            userTest: {
              posts: {
                edges: {
                  $unshift: [createNewPost],
                },
              },
            },
          });
          // Write our data back to the cache.
          store.writeQuery({
            query: profilePageQuery,
            variables: {
              _id: ownProps.user.id,
              cursor: null,
            },
            data,
          });
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
          const index = data.userTest.posts.findIndex(item => item._id === postId);
          const currentPost = data.userTest.posts[index];
          const updatedPost = Object.assign({}, currentPost, {
            message: newMessage,
          });
          data = update(data, {
            userTest: {
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
            userTest: {
              posts: {
                $unset: [deletePost._id],
              },
            },
          });
          // Write our data back to the cache.
          store.writeQuery({ query: profilePageQuery, data });
        },
      }),
    }),
  }),
  graphql(Feed.mutation.sharingPost, {
    props: ({ mutate }) => ({
      sharingPost: postId => mutate({
        variables: { _id: postId },
        update: (store, { data: { sharingPost } }) => {
          // Read the data from our cache for this query.
          let data = store.readQuery({ query: profilePageQuery, variables: {} });
          data = update(data, {
            userTest: {
              posts: {
                $unshift: [sharingPost],
              },
            },
          });
          store.writeQuery({ query: profilePageQuery, variables: {}, data });
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
          profilePageQuery: (previousResult, { mutationResult }) => {
            const newComment = mutationResult.data.createNewComment;
            const index = previousResult.userTest.posts.findIndex(item => item._id === postId);
            const currentPost = previousResult.userTest.posts[index];

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
              userTest: {
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
