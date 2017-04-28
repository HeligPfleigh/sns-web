import React, { PropTypes } from 'react';

import { Grid, Row, Col, Image } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import update from 'immutability-helper';
import s from './Me.scss';

import Tab from '../../components/Me/TabComponent/Tab';
import TimeLine from '../../components/Me/TimeLine';
import Info from '../../components/Me/InfoComponent/Info';
import NewPost from '../../components/NewPost';
import { MY_TIME_LINE, MY_PHOTO, MY_INFO } from '../../constants';
import TimeLineMe from '../../components/Me/TimeLineMe';


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


const homePageQuery = gql`query homePageQuery ($cursor: String) {
  feeds (cursor: $cursor) {
    edges {
      ...PostView
    }
    pageInfo {
      endCursor,
      hasNextPage
    }
  }
  me {
    ...UserView,
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
    const { data: { me, feeds } } = this.props;
    const edges = feeds ? feeds.edges : [];
    const avatar = me && me.profile && me.profile.picture;
    const profile = me && me.profile;

    const imageSrc = 'http://hdwallpaperfun.com/wp-content/uploads/2015/07/Awesome-Art-Landscape-Wallpaper.jpg';

    const numbers = 100;
    const createdAt = '20-04-2017';

    const events = [
      { time: createdAt,
        images: [imageSrc, imageSrc, imageSrc, imageSrc, imageSrc, imageSrc, imageSrc, imageSrc, imageSrc, imageSrc],
      },
    ];
    return (
      <Grid className={s.margintop30}>
        <Row >
          <Col sm={8} xs={12}>
            <div className={s.feedsContent}>
              <div className={s.topLayout}>
                <Image className={s.image} src={imageSrc} />


                <div className={s.userName} >

                  <Image className={s.avartar} src={avatar} />

                  { profile && (<h1 > {profile.lastName} {profile.firstName}</h1>) }
                </div>


              </div>
              <div className={s.infors}>


                <Tab numbers={numbers} stateChildShow={this.state.stateChildShow} onclicks={this.buttonClicked} />


              </div>
              <Grid fluid>
                {this.state.stateChildShow === MY_TIME_LINE && <div className={s.parent}><NewPost createNewPost={this.props.createNewPost} /> </div> }
                {this.state.stateChildShow === MY_TIME_LINE && <TimeLineMe
                  events={edges}
                  userInfo={me}
                  likePostEvent={this.props.likePost}
                  unlikePostEvent={this.props.unlikePost}

                /> }
                {this.state.stateChildShow === MY_PHOTO && <TimeLine events={events} /> }
                {this.state.stateChildShow === MY_INFO && <Info profile={profile} />}
              </Grid>
            </div>
          </Col>
          <Col sm={4} xs={12}>

          </Col>
        </Row >

      </Grid>

    );
  }
}

export default compose(
  withStyles(s),
  // graphql(mePageQuery),
   graphql(createNewPost, {
     props: ({ mutate }) => ({
       createNewPost: message => mutate({
         variables: { message },
         updateQueries: {
           homePageQuery: (previousResult, { mutationResult }) => {
             const newPost = mutationResult.data.createNewPost;
             return update(previousResult, {
               feeds: {
                 edges: {
                   $unshift: [newPost],
                 },
               },
             });
           },
         },
       }),
     }),
   }),
   graphql(homePageQuery, {
     options: () => ({
       variables: {},
     }),
     props: ({ data }) => {
       const { fetchMore } = data;

       const loadMoreRows = () => fetchMore({
         variables: {
           cursor: data.feeds.pageInfo.endCursor,
         },
         updateQuery: (previousResult, { fetchMoreResult }) => {
           const newEdges = fetchMoreResult.feeds.edges;
           const pageInfo = fetchMoreResult.feeds.pageInfo;
           return {
             feeds: {
               edges: [...previousResult.feeds.edges, ...newEdges],
               pageInfo,
             },
           };
         },
       });
       return {
         data,
         loadMoreRows,
       };
     },
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
           homePageQuery: (previousResult, { mutationResult }) => {
             const updatedPost = mutationResult.data.likePost;
             const index = previousResult.feeds.edges.findIndex(item => item._id === updatedPost._id);
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
          homePageQuery: (previousResult, { mutationResult }) => {
            const updatedPost = mutationResult.data.unlikePost;
            const index = previousResult.feeds.edges.findIndex(item => item._id === updatedPost._id);
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
