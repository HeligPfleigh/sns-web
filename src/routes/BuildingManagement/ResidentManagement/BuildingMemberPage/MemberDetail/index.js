import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import { compose } from 'react-apollo';
import { Grid, Row, Col } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import s from './styles.scss';
import UserInfo from './UserInfo';
import Menu from '../../../Menu/Menu';
import history from '../../../../../core/history';

class MemberDetail extends Component {

  goBack = () => history.goBack();

  render() {
    const { userMenu, buildingId, requestId, isUpdateInfo } = this.props;

    return (
      <Grid>
        <Row className={classNames(s.containerTop30)}>
          <MediaQuery minDeviceWidth={992} values={{ deviceWidth: 1600 }}>
            <Col md={3} smHidden xsHidden>
              <Menu
                user={userMenu}
                parentPath={`/management/${buildingId}`}
                pageKey={`resident_management>${isUpdateInfo ? 'change_info' : 'residents'}`}
              />
            </Col>
          </MediaQuery>
          <Col md={9} sm={12} xs={12}>
            <Row className={classNames(s.container)}>
              { !isUpdateInfo && <div className={classNames(s.goBack)} onClick={this.goBack}>
                <i className="fa fa-chevron-left" aria-hidden="true"></i>
                <h4>Quay lại trang</h4>
              </div> }
              {
                isUpdateInfo &&
                <div className={classNames(s['panel-title'])}>
                  <ol className={classNames('breadcrumb')}>
                    <li className={classNames(s['breadcrumb-item'])}>
                      <a href="#" onClick={this.goBack}>
                        <i className="fa fa-address-book" aria-hidden="true"></i>
                        Quản lý cư dân
                      </a>
                    </li>
                    <li>
                      <a href="#" onClick={this.goBack}>Danh sách cư dân</a>
                    </li>
                    <li className="active">Sửa đổi thông tin</li>
                  </ol>
                </div>
              }
              <h3>THÔNG TIN</h3>
              <UserInfo
                requestId={requestId}
                buildingId={buildingId}
                isUpdateInfo={isUpdateInfo || false}
              />
            </Row>
          </Col>
        </Row>
      </Grid>
    );
  }
}

MemberDetail.propTypes = {
  userMenu: PropTypes.object,
  isUpdateInfo: PropTypes.bool,
  buildingId: PropTypes.string.isRequired,
  requestId: PropTypes.string.isRequired,
};

export default compose(
  withStyles(s),
  connect(state => ({
    userMenu: state.user,
  })),
)(MemberDetail);
