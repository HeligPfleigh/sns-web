import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Grid, Row, Col } from 'react-bootstrap';
import MediaQuery from 'react-responsive';
import Loading from '../../../../components/Loading';
import Menu from '../../Menu/Menu';
import s from './MemberManagement.scss';

class MemberManagement extends Component {
  state= {
    loading: false,
  }
  render() {
    const { loading } = this.state;
    const { buildingId, user } = this.props;

    return (
      <Grid>
        <Loading show={loading} full>Đang tải ...</Loading>
        <Row className={s.containerTop30}>
          <MediaQuery minDeviceWidth={992} values={{ deviceWidth: 1600 }}>
            <Col md={3} smHidden xsHidden>
              <Menu
                user={user}
                parentPath={`/management/${buildingId}`}
                pageKey="resident_management>approve_member"
              />
            </Col>
          </MediaQuery>
          <Col md={9} sm={12} xs={12}>
            <div className={s.container}>
              <Col md={12} className={s.contentMain}>
                <h1>Trang đăng kí thành viên tòa nhà</h1>
              </Col>
            </div>
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
  connect(state => ({
    user: state.user,
  })),
  withStyles(s),
)(MemberManagement);
