import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import gql from 'graphql-tag';
import update from 'immutability-helper';
import { graphql, compose } from 'react-apollo';
import { Grid } from 'react-bootstrap';
import s from './Building.scss';
import FeedList, { Feed } from '../../components/Feed';

const loadBuildingQuery = gql`
  query loadBuildingQuery ($buildingId: String!) {
    building (_id: $buildingId) {
      _id
      name
      address {
        country
        city
        state
        street
      }
      posts {
        ...PostView
      }
    }
    me {
      _id
      username
      profile {
        picture
        firstName
        lastName
      }
    }
  }
${Feed.fragments.post}`;

function doNothing(evt) {
  evt.preventDefault();
}

class Building extends Component {
  render() {
    const { data: { loading, building, me }, likePost, unlikePost } = this.props;
    console.log(building);
    return (
      <Grid>
        { building && <div>
          name: { building.name } <br />
          address <br />
          <ul>
            <li>country: {building.address.country}</li>
            <li>city: {building.address.city}</li>
            <li>state: {building.address.state}</li>
            <li>street: {building.address.street}</li>
          </ul>
          new post here <br />
          { building && building.posts && <FeedList
            feeds={building ? building.posts : []}
            likePostEvent={likePost}
            unlikePostEvent={unlikePost}
            userInfo={me}
            loadMoreComments={doNothing}
            createNewComment={doNothing}
          />}
          if admin show request to join group <br />
        </div>
        }
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
  // buildingId: PropTypes.string.isRequired,
};

Building.defaultProps = {
  data: {
    loading: false,
  },
};

export default compose(
  withStyles(s),
  graphql(loadBuildingQuery, {
    options: props => ({
      variables: {
        buildingId: props.buildingId,
      },
    }),
  }),
  graphql(Feed.mutation.likePost, {
    props: ({ mutate }) => ({
      likePost: (postId, message, totalLikes, totalComments, user) => mutate({
        variables: {
          postId,
        },
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
          loadBuildingQuery: (previousResult, { mutationResult }) => {
            const updatedPost = mutationResult.data.likePost;
            const index = previousResult.building.posts.findIndex(item => item._id === updatedPost._id);
            return update(previousResult, {
              building: {
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
            __typename: 'Post',
            _id: postId,
            message,
            user: {
              __typename: 'Friend',
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
            const index = previousResult.building.posts.findIndex(item => item._id === updatedPost._id);
            return update(previousResult, {
              building: {
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
)(Building);
