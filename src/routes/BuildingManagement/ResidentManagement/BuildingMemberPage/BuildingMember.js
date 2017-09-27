import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import { compose } from 'react-apollo';
import { Grid, Row, Col } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Menu from '../../Menu/Menu';
import s from './BuildingMember.scss';
import { BuildingMemberList } from './BuildingMemberList';

class MemberManagement extends Component {

  render() {
    const { buildingId, user } = this.props;

    return (
      <Grid>
        <Row className={classNames(s.containerTop30)}>
          <MediaQuery minDeviceWidth={992} values={{ deviceWidth: 1600 }}>
            <Col md={3} smHidden xsHidden>
              <Menu
                user={user}
                parentPath={`/management/${buildingId}`}
                pageKey="resident_management>residents"
              />
            </Col>
          </MediaQuery>
          <Col md={9} sm={12} xs={12}>
            <Row className={classNames(s.container)}>
              <Col md={12} className={classNames(s['panel-title'])}>
                <ol className={classNames('breadcrumb')}>
                  <li className={classNames(s['breadcrumb-item'])}>
                    <a href="#">
                      <i className="fa fa-address-book" aria-hidden="true"></i>
                      Quản lý cư dân
                    </a>
                  </li>
                  <li className="active">Danh sách cư dân</li>
                </ol>
              </Col>
              <Col md={12}>
                <BuildingMemberList buildingId={buildingId} />
              </Col>
            </Row>
          </Col>
        </Row>
      </Grid>
    );
  }
}

MemberManagement.propTypes = {
  user: PropTypes.object.isRequired,
  buildingId: PropTypes.string.isRequired,
};

export default compose(
  withStyles(s),
  connect(state => ({
    user: state.user,
  })),
)(MemberManagement);
