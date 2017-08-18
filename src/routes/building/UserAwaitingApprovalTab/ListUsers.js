import React, { Component } from 'react';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroller';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Image, Col, Row, Clearfix, ButtonToolbar, ButtonGroup, Button } from 'react-bootstrap';
import * as _ from 'lodash';
import classNames from 'classnames';

import Errors from '../Errors';
import UserDetail from './UserDetail';
import BuildingInformationTab from '../BuildingInformationTab';
import s from './UserAwaitingApproval.scss';

class ListUsers extends Component {
  /**
   *
   * @param {*} props
   */
  constructor(...args) {
    super(...args);
    this.state = {
      userDetail: {},
      showModal: false,
    };

    this.onCloseUserDetailModal = this.onCloseUserDetailModal.bind(this);
    this.onOpenUserDetailModal = this.onOpenUserDetailModal.bind(this);
  }

  /**
   *
   */
  onCloseUserDetailModal() {
    this.setState({
      showModal: false,
      userDetail: {},
    });
  }

  onOpenUserDetailModal(userDetail) {
    return () => this.setState({
      showModal: true,
      userDetail,
    });
  }

  /**
   *
   */
  __renderLoadingIcon() {
    return (
      <div className={classNames(s.noRecordsFound, 'text-center')}>
        <i className="fa fa-spinner fa-spin" aria-hidden="true"></i> Đang tải dữ liệu ...
      </div>
    );
  }

  /**
   *
   */
  __renderNoRecordsFound() {
    return (
      <div className={classNames(s.noRecordsFound, 'text-center')}>
        Hiện tại chưa có yêu cầu từ cư dân của tòa nhà
      </div>
    );
  }

  /**
   *
   */
  __renderListUsers() {
    if (this.props.building.requests.edges.length === 0) {
      return this.__renderNoRecordsFound();
    }

    const buildingID = this.props.building._id;
    const users = [];
    this.props.building.requests.edges.forEach((obj) => {
      // Clone object
      const user = _.clone(obj);

      // Validate buidlings belongs to itself
      if (_.isUndefined(user.requestInformation) || _.isUndefined(user.requestInformation.apartments) || !_.isArray(user.requestInformation.apartments) || (user.requestInformation.apartments.length === 0)) {
        return;
      }

      // Determine whether valid apartments belong to itself
      user.apartments = user.requestInformation.apartments.filter(a => a.building._id === buildingID);

      // Validate buidlings belongs to itself
      if (_.isUndefined(user.apartments) || !_.isArray(user.apartments) || (user.apartments.length === 0)) {
        return;
      }

      // Determine whether valid phones belong to itself
      user.phones = (_.isUndefined(user.phone) || !_.isObject(user.phone) ? {} : user.phone);
      delete user.phone;

      // Determine whether valid emails belong to itself
      user.emails = (_.isUndefined(user.emails) || !_.isObject(user.emails) ? {} : user.emails);

      // Apply into valid users
      users.push(user);
    });

    if (users.length === 0) {
      return this.__renderNoRecordsFound();
    }

    return (
      <InfiniteScroll
        loadMore={this.props.loadMore}
        hasMore={this.props.building.requests.pageInfo.hasNextPage}
        loader={this.__renderLoadingIcon()}
      >
        { users.map(user => (
          <Row className={s.item} key={Math.random()}>
            <Col xs={4} md={3}>
              <Image src={user.profile.picture || 'avatar-default.jpg'} thumbnail responsive />
            </Col>
            <Col xs={8} md={9}>
              <h4 className={s.fullName}>{`${user.profile.fullName}`}</h4>

              <div className={s.moreInfo}>
                { user.apartments && (<div className={s.line}><b>Căn hộ:</b> {user.apartments.map(apartment => <span key={apartment._id}>{ apartment.name }</span>).reduce((prev, curr) => [prev, ' - ', curr]) }</div>) }

                { user.phones.number && (<div className={s.line}><b>Số điện thoại:</b> { user.phones.number }</div>) }

                { user.emails.address && (<div className={s.line}><b>Email:</b> { user.emails.address }</div>) }
              </div>

              <ButtonToolbar>

                <Button title="Xem thông tin của thành viên" bsStyle="info" bsSize="xsmall" onClick={this.onOpenUserDetailModal(user)}>
                  <i className="fa fa-info-circle" /> Xem thông tin
                  </Button>

                <ButtonGroup>

                  <Button title="Chấp nhận là thành viên của tòa nhà" bsStyle="primary" bsSize="xsmall" onClick={this.props.onAccept(user)}>
                    <i className="fa fa-check" /> Đồng ý
                    </Button>

                  <Button title="Không chấp nhận là thành viên của tòa nhà" bsStyle="danger" bsSize="xsmall" onClick={this.props.onCancel(user)}>
                    <i className="fa fa-remove" /> Từ chối
                    </Button>

                </ButtonGroup>

              </ButtonToolbar>
            </Col>
            <Clearfix />
          </Row>
          )) }
      </InfiniteScroll>
    );
  }

  /**
   *
   */
  render() {
    return (
      <div>
        <BuildingInformationTab building={this.props.building} />
        <div className={classNames('panel', 'panel-default', s.usersAwaitingApproval)}>
          <Errors
            open
            message={this.props.error}
            autoHideDuration={4000}
          />

          <div className={classNames('panel-heading', s.panelHeading)}>
            <h3>Danh sách đăng ký thành viên</h3>
            <div className={s.hr}></div>
          </div>

          <UserDetail
            show={this.state.showModal}
            closeModal={this.onCloseUserDetailModal}
            onCancel={this.props.onCancel}
            onAccept={this.props.onAccept}
            data={this.state.userDetail}
          />
          <div className={classNames('panel-body', s.panelBody)}>
            { this.props.loading ? this.__renderLoadingIcon() : this.__renderListUsers() }
          </div>
        </div>
      </div>
    );
  }
}

ListUsers.defaultProps = {
  building: {
    requests: {
      edges: [],
      pageInfo: {
        hasNextPage: false,
      },
    },
  },
};

ListUsers.PropTypes = {
  building: PropTypes.shape({
    requests: PropTypes.shape({
      edges: PropTypes.arrayOf(PropTypes.object),
      pageInfo: PropTypes.object,
    }),
    _id: PropTypes.string,
  }).isRequired,
  loadMore: PropTypes.func.isRequired,
  onAccept: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
};

ListUsers.defaultProps = {
  error: '',
  onAccept: _.noop,
  onCancel: _.noop,
};

export default withStyles(s)(ListUsers);
