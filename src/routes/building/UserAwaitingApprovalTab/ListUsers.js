import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import InfiniteScroll from 'react-infinite-scroller';
import update from 'immutability-helper';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Panel, Image, Col, Row, Clearfix, ButtonToolbar, ButtonGroup, Button } from 'react-bootstrap';
import * as _ from 'lodash';
import classNames from 'classnames';

import Errors from '../Errors';
import UserDetail from './UserDetail';
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
  render() {
    return (
      <Panel header="Danh sách thành viên của tòa nhà" className={ s.usersAwaitingApproval }>
        <Errors
          open
          message={ this.props.error }
          autoHideDuration={ 4000 }
        />
        
        <UserDetail 
          show={ this.state.showModal }
          closeModal={ this.onCloseUserDetailModal }
          onCancel={ this.props.onCancel }
          onAccept={ this.props.onAccept }
          data={ this.state.userDetail }
        />
        { this.props.loading ? this.__renderLoadingIcon() : this.__renderListUsers() }
      </Panel>
    );
  }

  /**
   * 
   */
  __renderLoadingIcon() {
    return (
      <div className={ classNames(s.noRecordsFound, 'text-center') }>
        <i className="fa fa-spinner fa-spin" aria-hidden="true"></i> Đang tải dữ liệu ...
      </div>
    );
  }

  /**
   * 
   */
  __renderNoRecordsFound() {
    return (
      <div className={ classNames(s.noRecordsFound, 'text-center') }>
        Hiện tại chưa có yêu cầu từ cư dân của tòa nhà
      </div>
    );
  }

  /**
   * 
   */
  __renderListUsers() {
    if (this.props.data.edges.length === 0) {
      return this.__renderNoRecordsFound();
    }

    const buildingID = this.props.building;
    const users = [];
    this.props.data.edges.forEach(obj => {
      if (!_.isArray(obj.building) || !_.isArray(obj.apartments) || (obj.building.length === 0) || (obj.apartments.length === 0)) {
        return;
      }

      // Clone object
      const user = _.clone(obj);

      // Determine whether valid buildings belong to itself
      user.buildings = user.building.filter(b => b._id === buildingID);
      delete user.building;
      
      // Validate buidlings belongs to itself
      if (_.isUndefined(user.buildings) || !_.isArray(user.buildings) || (user.buildings.length === 0)) {
        return;
      }

      // Determine whether valid apartments belong to itself
      user.apartments = user.apartments.filter(a => a.building._id === buildingID);

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
          loadMore={ this.props.loadMore }
          hasMore={ this.props.data.pageInfo.hasNextPage }
          loader={ this.__renderLoadingIcon() }
        >
        { users.map(user => {
          return (
            <Row className={ s.item } key={ Math.random() }>
              <Col xs={4} md={3}>
                <Image src={ user.profile.picture || '/avatar-default.jpg' } thumbnail responsive />
              </Col>
              <Col xs={8} md={9}>
                <label className={ s.fullName }>{`${user.profile.firstName} ${user.profile.lastName}`}</label>
                
                <div className={ s.moreInfo }>
                  { user.apartments.map(apartment => {
                    return <div key={ apartment._id }><small><i>Căn hộ số #{ apartment.number }, thuộc tòa nhà { apartment.building.name }</i></small></div>;
                  }) }

                  { user.phones.number && <div><small><i>Số điện thoại: { user.phones.number }</i></small></div> }
                  
                  { user.emails.address && <div><small><i>Email: { user.emails.address }</i></small></div> }
                </div>

                <ButtonToolbar>

                  <Button title="Xem thông tin của thành viên" bsStyle="info" bsSize="xsmall" onClick={ this.onOpenUserDetailModal(user) }>
                    <i className="fa fa-info-circle" /> Xem thông tin
                  </Button>

                  <ButtonGroup>

                    <Button title="Chấp nhận là thành viên của tòa nhà" bsStyle="primary" bsSize="xsmall" onClick={ this.props.onAccept(user) }>
                      <i className="fa fa-check" /> Đồng ý
                    </Button>

                    <Button title="Không chấp nhận là thành viên của tòa nhà" bsStyle="danger" bsSize="xsmall" onClick={ this.props.onCancel(user) }>
                      <i className="fa fa-remove" /> Từ chối
                    </Button>

                  </ButtonGroup>

                </ButtonToolbar>
              </Col>
              <Clearfix />
            </Row>
          )
        } ) } 
      </InfiniteScroll>
    );
  }
}

ListUsers.defaultProps = {
  data: {
    edges: [],
    pageInfo: {
      hasNextPage: false,
    }
  }
};

ListUsers.PropTypes = {
  data: PropTypes.shape({
    edges: PropTypes.arrayOf(PropTypes.object),
    pageInfo: PropTypes.object,
  }).isRequired,
  loadMore: PropTypes.func.isRequired,
  onAccept: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  building: PropTypes.string.isRequired,
  error: PropTypes.string.isRequired,
};

ListUsers.defaultProps = {
  error: '',
  onAccept: _.noop,
  onCancel: _.noop,
};

export default withStyles(s)(ListUsers);
