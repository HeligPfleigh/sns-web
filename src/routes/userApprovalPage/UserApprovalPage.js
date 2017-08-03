import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import { Grid, Row, Col } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './UserApprovalPage.scss';

class UserApprovalPage extends Component {
  render() {
    return (
      <Grid>
        <Row className={s.containerTop30}>
          <Col md={8} sm={12} xs={12}>
            123
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default compose(
  withStyles(s),
)(UserApprovalPage);
