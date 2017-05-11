import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Grid, Row, Col, Image } from 'react-bootstrap';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import update from 'immutability-helper';
import Tab from '../../components/Me/TabComponent/Tab';
import Info from '../../components/Me/InfoComponent/Info';
import NewPost from '../../components/NewPost';
import imageSrc from './Awesome-Art-Landscape-Wallpaper.jpg';
import Post from '../../components/Post';
import { MY_TIME_LINE, MY_INFO } from '../../constants';
import s from './User.scss';


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

const profilePageQuery = gql`query profilePageQuery($_id: String!) {
        user(_id : $_id){
         ...UserView,
         posts {
         ...PostView
             }
      }
    
  
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
class User extends Component {
  static propTypes = {
    data: PropTypes.object,
    createNewPost: PropTypes.func.isRequired,
    likePost: PropTypes.func.isRequired,
    unlikePost: PropTypes.func.isRequired,
    query: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    // query: PropTypes.object.isRequired,
  };

  render() {
    const { data: { user }, query, id } = this.props;
    const edges = user ? user.posts : [];
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
                    <NewPost createNewPost={this.props.createNewPost} />
                  </div>
                  { edges.map(data => (
                    <Post
                      key={data._id}
                      data={data}
                      userInfo={user}
                      likePostEvent={this.props.likePost}
                      unlikePostEvent={this.props.unlikePost}
                    />
                ))}
                </div>
                <div className={tab === MY_INFO ? s.active : s.inactive}>
                  {profile && <Info profile={profile} isMe={false} />}
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
    options: props => ({
      variables: { _id: props.id },
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
              _id: ownProps.id,
              username: ownProps.username,
              profile: ownProps.profile,
            },
            createdAt: new Date(),
            totalLikes: 0,
            totalComments: 0,
            isLiked: false,
          },
        },
        updateQueries: {
          profilePageQuery: (previousResult, { mutationResult }) => {
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
)(User);
