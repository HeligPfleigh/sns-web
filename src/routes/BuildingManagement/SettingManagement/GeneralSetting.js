import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Grid, Row, Col } from 'react-bootstrap';
import MediaQuery from 'react-responsive';

import Menu from '../Menu/Menu';
import s from './GeneralSetting.scss';

class GeneralSetting extends Component {
  render() {
    const { buildingId, user } = this.props;
    return (
      <Grid>
        <Row className={s.containerTop30}>
          <MediaQuery minDeviceWidth={992} values={{ deviceWidth: 1600 }}>
            <Col md={3} smHidden xsHidden>
              <Menu pageKey="settings.general" parentPath={`/management/${buildingId}`} user={user} />
            </Col>
          </MediaQuery>
          <Col md={9} sm={12} xs={12} className={s.container}>
            <Col xs={12}>
              <ol className="breadcrumb">
                <li className={s.breadcrumbItem}>
                  <i className="fa fa-cog" aria-hidden="true"></i> Cài đặt chung
                  </li>
              </ol>
            </Col>
          </Col>
        </Row>
      </Grid>);
  }
}

GeneralSetting.propTypes = {
  buildingId: PropTypes.string.isRequired,
  user: PropTypes.shape({
    id: PropTypes.string,
    isAdmin: PropTypes.bool,
  }).isRequired,
};

export default compose(
  withStyles(s),
  connect(state => ({
    user: state.user,
  })),
)(GeneralSetting);
