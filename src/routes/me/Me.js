import React, { Component } from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash/throttle';
import { connect } from 'react-redux';
import { Grid, Row, Col, Image } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { graphql, compose } from 'react-apollo';
import InfiniteScroll from 'react-infinite-scroller';
import update from 'immutability-helper';
import { generate as idRandom } from 'shortid';

import s from './Me.scss';
import UserInfoTab from './InfoTab';
import FeedList from './FeedList';
import { Feed } from '../../components/Feed';
import Loading from '../../components/Loading';
import NewPost from '../../components/NewPost';
import Tab from '../../components/Me/TabComponent/Tab';
import FriendList from '../../components/Me/FriendsComponent/FriendList';
import imageSrc from './Awesome-Art-Landscape-Wallpaper.jpg';
import CommentList from '../../components/Comments/CommentList';
import { PUBLIC, MY_TIME_LINE, MY_INFO, MY_FRIEND } from '../../constants';
import profilePageQuery from '../../graphqls/queries/UserPageQueries/ProfilePageQuery.graphql';
import morePostsProfilePageQuery from '../../graphqls/queries/UserPageQueries/MorePostsProfilePageQuery.graphql';

class Me extends Component {

  updatePostInList = (data, index, post) => (update(data, {
    resident: {
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
    const {
      data: {
        me,
        resident,
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

    // Show loading
    if (loading) {
      return <Loading show={loading} full>Đang tải ...</Loading>;
    }

    const profile = me && me.profile;
    const avatar = profile ? profile.picture : '';
    const numbers = 100;

    let tab = MY_TIME_LINE;
    switch (query.tab) {
      case MY_FRIEND:
        tab = MY_FRIEND;
        break;
      case MY_INFO:
        tab = MY_INFO;
        break;
      default:
        tab = MY_TIME_LINE;
        break;
    }

    let hasNextPage = false;
    if (resident && resident.posts && resident.posts.pageInfo) {
      hasNextPage = resident.posts.pageInfo.hasNextPage;
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
                  {profile && (<h1>{profile.firstName} {profile.lastName}</h1>)}
                </div>
              </div>
              <div className={s.infors}>
                <Tab numbers={numbers} stateChildShow={tab} isMe />
              </div>
              <Grid fluid>
                <div className={tab === MY_TIME_LINE ? s.active : s.inactive} style={{ marginTop: '-8px' }}>
                  { tab === MY_TIME_LINE &&
                    <span>
                      <div className={s.parent}>
                        <NewPost createNewPost={createNewPost} />
                      </div>
                      <InfiniteScroll
                        loadMore={this.loadMoreRows}
                        hasMore={hasNextPage}
                        loader={<div className="loader">Loading ...</div>}
                      >
                        <FeedList
                          feeds={resident.posts.edges}
                          userInfo={me}
                          loadMoreComments={loadMoreComments}
                          createNewComment={createNewComment}
                          deletePost={deletePost}
                          editPost={editPost}
                          sharingPost={sharingPost}
                          updatePost={this.updatePostInList}
                        />
                      </InfiniteScroll>
                    </span>
                  }
                </div>

                <div className={tab === MY_FRIEND ? s.active : s.inactive}>
                  { tab === MY_FRIEND && <FriendList userId={me._id} /> }
                </div>

                <div className={tab === MY_INFO ? s.active : s.inactive}>
                  { tab === MY_INFO && <UserInfoTab /> }
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
      posts: PropTypes.arrayOf(PropTypes.object),
      profile: PropTypes.shape({
        picture: PropTypes.string,
        firstName: PropTypes.string,
        lastName: PropTypes.string,
      }),
    }),
  }),
  createNewComment: PropTypes.func.isRequired,
  createNewPost: PropTypes.func.isRequired,
  loadMoreRows: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  loadMoreComments: PropTypes.func.isRequired,
  query: PropTypes.shape({
    tab: PropTypes.string,
  }),
  editPost: PropTypes.func.isRequired,
  sharingPost: PropTypes.func.isRequired,
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
      if (!data) {
        return null;
      }

      const { fetchMore } = data;
      const loadMoreRows = throttle(() => fetchMore({
        variables: {
          _id: ownProps.user.id,
          cursor: data.resident.posts.pageInfo.endCursor,
        },
        query: morePostsProfilePageQuery,
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newEdges = fetchMoreResult.resident.posts.edges;
          const pageInfo = fetchMoreResult.resident.posts.pageInfo;
          return update(previousResult, {
            resident: {
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
          const index = previousResult.resident.posts.findIndex(item => item._id === fetchMoreResult.post._id);
          const updatedPost = update(previousResult.resident.posts[index], {
            comments: {
              $push: fetchMoreResult.post.comments,
            },
          });
          return update(previousResult, {
            resident: {
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
      createNewPost: (message, privacy, photos) => mutate({
        variables: { message, privacy, photos },
        optimisticResponse: {
          __typename: 'Mutation',
          createNewPost: {
            __typename: 'Post',
            _id: idRandom(),
            message,
            type: null,
            user: null,
            author: null,
            building: null,
            sharing: null,
            event: null,
            privacy,
            photos,
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
            resident: {
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
      editPost: (post, isDelPostSharing) => mutate({
        variables: {
          postId: post._id,
          message: post.message,
          photos: post.photos || [],
          privacy: post.privacy || PUBLIC,
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
            query: profilePageQuery,
            variables: {
              _id: ownProps.user.id,
              cursor: null,
            },
          });
          data = update(data, {
            resident: {
              posts: {
                edges: {
                  $unset: [deletePost._id],
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
  graphql(Feed.mutation.sharingPost, {
    props: ({ ownProps, mutate }) => ({
      sharingPost: (postId, privacy, message, friendId, userId) => mutate({
        variables: {
          _id: postId,
          privacy: privacy || PUBLIC,
          message,
          friendId,
          userId,
        },
        update: (store, { data: { sharingPost } }) => {
          // Read the data from our cache for this query.
          if (ownProps.user.id === (sharingPost.user && sharingPost.user._id)) {
            let data = store.readQuery({
              query: profilePageQuery,
              variables: {
                _id: ownProps.user.id,
                cursor: null,
              },
            });
            data = update(data, {
              resident: {
                posts: {
                  edges: {
                    $unshift: [sharingPost],
                  },
                },
              },
            });
            store.writeQuery({
              query: profilePageQuery,
              variables: {
                _id: ownProps.user.id,
                cursor: null,
              },
              data,
            });
          }
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
            const index = previousResult.resident.posts.edges.findIndex(item => item._id === postId);
            const currentPost = previousResult.resident.posts.edges[index];

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
              resident: {
                posts: {
                  edges: {
                    $splice: [[index, 1, updatedPost]],
                  },
                },
              },
            });
          },
        },
      }),
    }),
  }),
)(Me);
