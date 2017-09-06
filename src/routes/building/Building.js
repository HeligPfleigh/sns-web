import React, { Component } from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash/throttle';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import gql from 'graphql-tag';
import update from 'immutability-helper';
import { graphql, compose } from 'react-apollo';
import {
  Grid,
  Row,
  Col,
  Tab,
  NavItem,
  Nav,
} from 'react-bootstrap';
import { generate as idRandom } from 'shortid';
import { Feed } from '../../components/Feed';
import CommentList from '../../components/Comments/CommentList';
import history from '../../core/history';
import { PUBLIC } from '../../constants';
import deletePostOnBuildingMutation from './graphql/deletePostOnBuildingMutation.graphql';
import Sponsored from './Sponsored';
import BuildingFeedTab from './BuildingFeedTab';
import BuildingInformationTab from './BuildingInformationTab';
// import BuildingAnnouncementTab from './BuildingAnnouncementTab';
import DocumentTab from './DocumentTab';
import FAQTab from './FAQTab';
import s from './Building.scss';

const POST_TAB = 'POST_TAB';
// const MEMBERS_TAB = 'MEMBERS_TAB';
// const ANNOUNCEMENT_TAB = 'ANNOUNCEMENT_TAB';
const INFO_TAB = 'INFO_TAB';
const BUILDING_MANAGEMENT_TAB = 'BUILDING_MANAGEMENT_TAB';
const DOCUMENT_TAB = 'DOCUMENT_TAB';
const FAQ_TAB = 'FAQ_TAB';

const loadBuildingQuery = gql`
  query loadBuildingQuery ($buildingId: String!, $cursor: String) {
    building (_id: $buildingId) {
      _id
      name
      address {
        basisPoint
        country
        province
        district
        ward
        street
        countryCode
      }
      posts(cursor: $cursor) {
        edges {
          ...PostView
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
      isAdmin
    }
    me {
      _id
      username
      profile {
        picture
        firstName
        lastName
      }
      friends {
        _id
        fullName
        profile {
          picture
          firstName
          lastName
        }
      }
    }
  }
${Feed.fragments.post}`;

const loadMorePostOnBuildingQuery = gql`
  query loadMorePostOnBuildingQuery ($buildingId: String!, $cursor: String, $limit: Int) {
    building (_id: $buildingId) {
      posts (cursor: $cursor, limit: $limit) {
        edges {
          ...PostView
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
${Feed.fragments.post}`;

const createNewPostOnBuildingMutation = gql`mutation createNewPostOnBuilding ($message: String!, $photos: [String], $buildingId: String!, $privacy: PrivacyType) {
  createNewPostOnBuilding(message: $message, photos: $photos, buildingId: $buildingId, privacy: $privacy) {
    ...PostView
  }
}
${Feed.fragments.post}
`;

class Building extends Component {

  constructor(props) {
    super(props);
    this.state = {
      errorMessage: '',
      activeTab: POST_TAB,
    };

    this.loadMoreFeeds = this.loadMoreFeeds.bind(this);
  }

  handleSelect = (key) => {
    if (key !== BUILDING_MANAGEMENT_TAB) {
      const { pathname } = history.location;
      history.push(`${pathname}?tab=${key}`);
    }
  }

  loadMoreFeeds = () => {
    const {
      loadMoreFeeds,
      query,
    } = this.props;
    if (query && (query.tab === POST_TAB || !query.tab)) {
      loadMoreFeeds();
    }
  }

  render() {
    const {
      data: { building, me },
      likePost,
      unlikePost,
      createNewComment,
      loadMoreComments,
      createNewPostOnBuilding,
      deletePostOnBuilding,
      query,
      editPost,
      sharingPost,
    } = this.props;

    let tab = POST_TAB;
    if (query.tab) {
      tab = query.tab;
    }

    return (
      <Grid>
        <Tab.Container onSelect={this.handleSelect} activeKey={tab} id={Math.random()}>
          <Row className={s.containerTop30}>
            <Col sm={2}>
              <Nav bsStyle="pills" stacked>
                <NavItem title="Tất cả bài viết" eventKey={POST_TAB}>
                  <i className="fa fa-pencil" aria-hidden="true"></i>
                  Bài viết
                </NavItem>
                { /*
                  <NavItem title="Thành viên thuộc chung cư" eventKey={MEMBERS_TAB}>
                    <i className="fa fa-address-book" aria-hidden="true"></i>
                    Thành viên
                  </NavItem>
                */ }
                <NavItem title="Thông tin tòa nhà" eventKey={INFO_TAB}>
                  <i className="fa fa-building" aria-hidden="true"></i>
                  Thông tin chung
                </NavItem>
                <NavItem title="Biểu mẫu" eventKey={DOCUMENT_TAB}>
                  <i className="fa fa-file-pdf-o" aria-hidden="true"></i>
                  Biểu mẫu
                </NavItem>
                <NavItem title="Câu hỏi thơờng gặp" eventKey={FAQ_TAB}>
                  <i className="fa fa-question-circle" aria-hidden="true"></i>
                  Hỏi - đáp
                </NavItem>
                { building && building.isAdmin && <NavItem
                  title="Truy cập trang quản lý của tòa nhà"
                  eventKey={BUILDING_MANAGEMENT_TAB}
                  onClick={() => history.push(`/management/${building._id}`)}
                >
                  <i className="fa fa-tachometer" aria-hidden="true"></i>
                  Quản lý tòa nhà
                </NavItem>}
                { /* building && building.isAdmin && <NavItem title="Thông báo của tòa nhà" eventKey={ANNOUNCEMENT_TAB}>
                  <i className="fa fa-bullhorn" aria-hidden="true"></i>
                  Thông báo *
                </NavItem> */ }
              </Nav>
            </Col>
            <Col sm={7}>
              <Tab.Content animation>
                <Tab.Pane eventKey={POST_TAB}>
                  {building && building.posts && <BuildingFeedTab
                    loadMoreFeeds={this.loadMoreFeeds}
                    createNewPostOnBuilding={createNewPostOnBuilding}
                    building={building}
                    likePost={likePost}
                    unlikePost={unlikePost}
                    me={me || {}}
                    loadMoreComments={loadMoreComments}
                    createNewComment={createNewComment}
                    deletePostOnBuilding={deletePostOnBuilding}
                    editPost={editPost}
                    sharingPost={sharingPost}
                    queryData={loadBuildingQuery}
                    paramData={{
                      cursor: null,
                      buildingId: building._id,
                    }}
                  />
                  }
                </Tab.Pane>
                <Tab.Pane eventKey={INFO_TAB}>
                  { building && <BuildingInformationTab building={building} />}
                </Tab.Pane>
                <Tab.Pane eventKey={DOCUMENT_TAB}>
                  { building && <DocumentTab building={building} />}
                </Tab.Pane>
                <Tab.Pane eventKey={FAQ_TAB}>
                  { building && <FAQTab building={building} />}
                </Tab.Pane>
                { /* building && building.isAdmin && <Tab.Pane eventKey={ANNOUNCEMENT_TAB}>
                  <BuildingAnnouncementTab
                    building={building}
                    loadBuildingQuery={loadBuildingQuery}
                    param={{
                      buildingId: building._id,
                      limit: 1000,
                    }}
                  />
                  </Tab.Pane> */ }
              </Tab.Content>
            </Col>
            <Col sm={3}>
              <Sponsored />
            </Col>
          </Row>
        </Tab.Container>
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
  loadMoreFeeds: PropTypes.func.isRequired,
  createNewComment: PropTypes.func.isRequired,
  loadMoreComments: PropTypes.func.isRequired,
  createNewPostOnBuilding: PropTypes.func.isRequired,
  deletePostOnBuilding: PropTypes.func.isRequired,
  query: PropTypes.object.isRequired,
  editPost: PropTypes.func.isRequired,
  sharingPost: PropTypes.func.isRequired,
};

export default compose(
  withStyles(s),
  graphql(loadBuildingQuery, {
    options: props => ({
      variables: {
        buildingId: props.buildingId,
      },
    }),
    props: ({ data }) => {
      const { fetchMore } = data;
      const loadMoreFeeds = throttle(() => fetchMore({
        query: loadMorePostOnBuildingQuery,
        variables: {
          buildingId: data.building._id,
          cursor: data.building.posts.pageInfo.endCursor,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return null;
          }
          return update(previousResult, {
            building: {
              posts: {
                edges: {
                  $push: fetchMoreResult.building.posts.edges,
                },
                pageInfo: {
                  $set: fetchMoreResult.building.posts.pageInfo,
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
          if (!fetchMoreResult) {
            return null;
          }
          const index = previousResult.building.posts.edges.findIndex(item => item._id === postId);
          const updatedPost = update(previousResult.building.posts[index], {
            comments: {
              $push: fetchMoreResult.post.comments,
            },
          });
          return update(previousResult, {
            building: {
              posts: {
                edges: {
                  $splice: [[index, 1, updatedPost]],
                },
              },
            },
          });
        },
      });

      return {
        data,
        loadMoreFeeds,
        loadMoreComments,
      };
    },
  }),
  graphql(createNewPostOnBuildingMutation, {
    props: ({ ownProps, mutate }) => ({
      createNewPostOnBuilding: (message, privacy, photos) => mutate({
        variables: {
          message,
          buildingId: ownProps.buildingId,
          photos,
          privacy,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          createNewPostOnBuilding: {
            __typename: 'Post',
            _id: idRandom(),
            message,
            type: null,
            user: null,
            author: {
              __typename: 'Author',
              _id: ownProps.data.me._id,
              username: ownProps.data.me.username,
              profile: ownProps.data.me.profile,
            },
            building: {
              __typename: 'Building',
              _id: ownProps.data.building._id,
              name: ownProps.data.building.name,
            },
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
        update: (store, { data: { createNewPostOnBuilding } }) => {
          // Read the data from our cache for this query.
          let data = store.readQuery({
            query: loadBuildingQuery,
            variables: {
              buildingId: ownProps.buildingId,
              limit: 1000, // FIXME: paging
            },
          });
          data = update(data, {
            building: {
              posts: {
                edges: {
                  $unshift: [createNewPostOnBuilding],
                },
              },
            },
          });
          // Write our data back to the cache.
          store.writeQuery({
            query: loadBuildingQuery,
            variables: {
              buildingId: ownProps.buildingId,
              limit: 1000, // FIXME: paging
            },
            data,
          });
        },
      }),
    }),
  }),
  graphql(Feed.mutation.likePost, {
    props: ({ mutate }) => ({
      likePost: (postId, message, totalLikes) => mutate({
        variables: {
          postId,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          likePost: {
            __typename: 'PostSchemas',
            _id: postId,
          },
        },
        updateQueries: {
          loadBuildingQuery: (previousResult, { mutationResult }) => {
            let updatedPost = mutationResult.data.likePost;
            const index = previousResult.building.posts.edges.findIndex(item => item._id === updatedPost._id);
            updatedPost = Object.assign({}, previousResult.building.posts.edges[index], {
              totalLikes: totalLikes + 1,
              isLiked: true,
            });
            return update(previousResult, {
              building: {
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
          loadBuildingQuery: (previousResult, { mutationResult }) => {
            let updatedPost = mutationResult.data.unlikePost;
            const index = previousResult.building.posts.edges.findIndex(item => item._id === updatedPost._id);
            updatedPost = Object.assign({}, previousResult.building.posts.edges[index], {
              totalLikes: totalLikes - 1,
              isLiked: false,
            });
            return update(previousResult, {
              building: {
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
  graphql(deletePostOnBuildingMutation, {
    props: ({ ownProps, mutate }) => ({
      deletePostOnBuilding: postId => mutate({
        variables: {
          postId,
          buildingId: ownProps.buildingId,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          deletePostOnBuilding: {
            __typename: 'Post',
            _id: postId,
          },
        },
        updateQueries: {
          loadBuildingQuery: (previousResult, { mutationResult }) => {
            const post = mutationResult.data.deletePostOnBuilding;
            return update(previousResult, {
              building: {
                posts: {
                  edges: {
                    $unset: [post._id],
                  },
                },
              },
            });
          },
        },
      }),
    }),
  }),
  graphql(Feed.mutation.sharingPost, {
    props: ({ mutate }) => ({
      sharingPost: (postId, privacy, message, friendId, userId) => mutate({
        variables: {
          _id: postId,
          privacy: privacy || PUBLIC,
          message,
          friendId,
          userId,
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
            const index = previousResult.building.posts.edges.findIndex(item => item._id === postId);
            const currentPost = previousResult.building.posts.edges[index];
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
)(Building);
