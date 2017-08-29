import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Grid, Row, Col } from 'react-bootstrap';
import MediaQuery from 'react-responsive';
import Loading from '../../../components/Loading';
import Menu from '../Menu/Menu';
import s from './styles.scss';

class Services extends Component {
  state= {
    loading: false,
  }
  render() {
    const { loading } = this.state;
    const { apartmentId, user } = this.props;
    console.log(this.props);

    return (
      <Grid>
        <Loading show={loading} full>Đang tải ...</Loading>
        <Row className={s.containerTop30}>
          <MediaQuery minDeviceWidth={992} values={{ deviceWidth: 1600 }}>
            <Col md={3} smHidden xsHidden>
              <Menu
                user={user}
                parentPath={`/apartment/${apartmentId}`}
                pageKey="services"
              />
            </Col>
          </MediaQuery>
          <Col md={9} sm={12} xs={12}>
            <div className={s.container}>
              <Col md={12} className={s.contentMain}>
                <h1>Trang dịch vụ</h1>
              </Col>
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }
}

Services.propTypes = {
  user: PropTypes.object.isRequired,
  apartmentId: PropTypes.string.isRequired,
};

export default compose(
  connect(state => ({
    user: state.user,
  })),
  withStyles(s),
)(Services);
