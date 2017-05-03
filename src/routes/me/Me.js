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
import { MY_TIME_LINE, MY_INFO } from '../../constants';
import imageSrc from './Awesome-Art-Landscape-Wallpaper.jpg';
import Post from '../../components/Post';

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


const profilePageQuery = gql`query profilePageQuery {
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


class Me extends React.Component {
  static propTypes = {
    data: PropTypes.object,
    createNewPost: PropTypes.func.isRequired,
    likePost: PropTypes.func.isRequired,
    unlikePost: PropTypes.func.isRequired,

  };
  constructor(props) {
    super(props);

    this.state = {
      stateChildShow: MY_TIME_LINE,
      isTimeLineMe: true,
    };
  }


  buttonClicked = (state) => {
    this.setState({
      stateChildShow: state,
    });
  }
  render() {
    const { data: { me } } = this.props;
    const edges = me ? me.posts : [];
    const avatar = me && me.profile && me.profile.picture;
    const profile = me && me.profile;
    const numbers = 100;

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
                <Tab numbers={numbers} stateChildShow={this.state.stateChildShow} onclicks={this.buttonClicked} />
              </div>
              <Grid fluid>
                {this.state.stateChildShow === MY_TIME_LINE && <div className={s.parent}><NewPost createNewPost={this.props.createNewPost} /> </div> }
                {/** this.state.stateChildShow === MY_TIME_LINE && <TimeLineMe
                  events={edges}
                  userInfo={me}
                  likePostEvent={this.props.likePost}
                  unlikePostEvent={this.props.unlikePost}
                />*/}
                {this.state.stateChildShow === MY_TIME_LINE && edges.map(data => (
                  <Post
                    key={data._id}
                    data={data}
                    userInfo={me}
                    likePostEvent={this.props.likePost}
                    unlikePostEvent={this.props.unlikePost}
                  />
                ))}
                {this.state.stateChildShow === MY_INFO && <Info profile={profile} />}
              </Grid>
            </div>
          </Col>
          <Col sm={4} xs={12}>123</Col>
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
              _id: ownProps.data.me._id,
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
            console.log(ownProps);
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
)(Me);
