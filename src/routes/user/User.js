import React, { Component } from 'react';
import { compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Grid } from 'react-bootstrap';
import s from './User.scss';

class User extends Component {
  static propTypes = {};

  render() {
    return (
      <Grid>
        User
      </Grid>
    );
  }
}

export default compose(
  withStyles(s),
)(User);
