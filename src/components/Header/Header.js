/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Grid, Row, Col, Button } from 'react-bootstrap';
import MediaQuery from 'react-responsive';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import update from 'immutability-helper';
import s from './Header.scss';
import SearchBox from '../SearchBox';
import Navigation from '../Navigation';
import NavRight from '../NavRight';
import history from '../../core/history';

import { PENDING, NONE, ACCEPTED, REJECTED } from '../../constants';
// import logoUrl from './logo-small.png';
// import logoUrl2x from './logo-small@2x.png';

// const userInfoQuery = gql`query userInfoQuery {
//   me {
//     _id
//     profile {
//       firstName
//       lastName
//       picture
//     }
//   }
// }
// `;
const friendsPageQuery = gql`query friendsPageQuery {
  me {
    _id,
    username,
    profile {
      picture,
      firstName,
      lastName
    }
    friends {
      _id
      profile {
        picture,
        firstName,
        lastName
      }
    }
    friendRequests {
      _id
      profile {
        picture,
        firstName,
        lastName
      }
    }
    friendSuggestions {
      _id
      profile {
        picture,
        firstName,
        lastName
      }
    }
  }
}
`;

const friendAction = gql`mutation friendAction ($userId: String!, $cmd: String!) {
  friendAction(userId: $userId, cmd: $cmd) {
    _id,
  }
}`;

@graphql(friendsPageQuery)
@graphql(friendAction, { name: 'friendAction' })
class Header extends React.Component {
  static propTypes = {
    friendAction: PropTypes.func.isRequired,
    data: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
    }).isRequired,
  };
  handleFriendAction = (userId, cmd) => {
    this.props.friendAction({
      variables: { userId, cmd },
      ...cmd === PENDING && {
        refetchQueries: [{
          query: friendsPageQuery,
        }],
      },
      ...(cmd === ACCEPTED || cmd === REJECTED) && {
        updateQueries: {
          friendsPageQuery: (previousResult, { mutationResult }) => {
            const newFriend = mutationResult.data.friendAction;
            return update(previousResult, {
              me: {
                friends: {
                  $unshift: [newFriend],
                },
                friendRequests: {
                  $unset: [newFriend._id],
                },
              },
            });
          },
        },
      },
    });
  }
  gotoHomePage =() => {
    history.push('/');
  }

  render() {
    const { data: { me } } = this.props;

    return (
      <div className={s.root} >
        <Grid>
          <Row>
            <Col md={6} sm={6} xs={6}>
              <Button onClick={this.gotoHomePage} bsStyle="danger">HX</Button>
              <MediaQuery query="(min-width: 992px)">
                <SearchBox />
              </MediaQuery>
              <MediaQuery query="(max-width: 992px)">
                <SearchBox isMobile />
              </MediaQuery>
            </Col>
            <Col md={6} sm={6} xs={6} >
              <NavRight user={me} />
              <MediaQuery query="(min-width: 992px)">
                <Navigation handleFriendAction={this.handleFriendAction} friendType={PENDING} friends={me.friendRequests} />
              </MediaQuery>
            </Col>
          </Row>
          <MediaQuery query="(max-width: 992px)">
            <div className={s.boxMobileHeader}>
              <Navigation user={me} isMobile />
            </div>
          </MediaQuery>
        </Grid>
      </div>
    );
  }
}

export default compose(
  withStyles(s),

  graphql(friendsPageQuery, {}),
)(Header);
