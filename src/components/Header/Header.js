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

import s from './Header.scss';
import SearchBox from '../SearchBox';
import Navigation from '../Navigation';
import NavRight from '../NavRight';
import history from '../../core/history';
// import logoUrl from './logo-small.png';
// import logoUrl2x from './logo-small@2x.png';

const userInfoQuery = gql`query userInfoQuery {
  me {
    _id
    profile {
      firstName
      lastName
      picture
    }
  }
}
`;

class Header extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
    }).isRequired,
  };

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
                <Navigation />
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
  graphql(userInfoQuery, {}),
)(Header);
