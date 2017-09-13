import React from 'react';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroller';
import { Row, Col, Modal, ButtonGroup, Button, Image, Clearfix } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import classNames from 'classnames';
import { graphql, compose } from 'react-apollo';
import throttle from 'lodash/throttle';
import update from 'immutability-helper';

import Loading from '../../Loading';
import InvitationToEventModal from './InvitationToEventModal';
import ResidentsInBuildingQuery from './ResidentsInBuildingQuery.graphql';
import s from './InviteToEventModal.scss';

class InviteResidentToEventModal extends InvitationToEventModal {
  constructor(...args) {
    super(...args);

    this.existingFriends = [];
    this.users = [];
  }

  onSelectAllFriends = selectedAllFrends => (event) => {
    event.preventDefault();

    this.setState({
      friendSelected: selectedAllFrends ? this.users.map(user => user._id) : [],
      selectedAllFrends,
    });
  }

  render() {
    const { data: { residentsInBuilding, loading }, ignoreFriends } = this.props;

    // Show loading
    if (loading) {
      return <Loading show={loading} full>Đang tải ...</Loading>;
    }

    const { friendSelected } = this.state;
    const validFriends = residentsInBuilding.edges.filter(f => ignoreFriends.indexOf(f.user._id) === -1);
    validFriends.forEach(({ user }) => {
      if (this.existingFriends.indexOf(user._id) === -1) {
        this.existingFriends.push(user._id);
        this.users.push(user);
      }
    });

    return (
      <Modal show={this.props.show} onHide={this.props.closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Gửi lời mời tham gia sự kiện tới các thành viên khác</Modal.Title>
        </Modal.Header>
        <Modal.Body className={s.list}>
          <InfiniteScroll
            loader={<div className="loader">Loading ...</div>}
            loadMore={this.props.loadMoreRows}
            hasMore={residentsInBuilding.pageInfo.hasNextPage}
            useWindow={false}
          >
            { this.users.map((user) => {
              const hasSelected = friendSelected.includes(user._id);
              return (
                <Row className={classNames(s.friend, { active: hasSelected })} onClick={this.onFriendClick(user._id)} key={user._id}>
                  <Col xs={2}>
                    <Image src={user.profile.picture} thumbnail responsive />
                  </Col>
                  <Col xs={9} className={s.fullName}>
                    {user.profile.fullName}
                  </Col>
                  <Col xs={1} className={s.iconCheck}>
                    {hasSelected ? <i className="fa fa-check-circle-o" aria-hidden="true"></i> : <i className="fa fa-circle-o" aria-hidden="true"></i>}
                  </Col>
                </Row>);
            })}
          </InfiniteScroll>
          <Clearfix />
        </Modal.Body>
        <Modal.Footer>
          <ButtonGroup className="pull-left">
            <Button type="button" onClick={this.onSelectAllFriends(true)}>Chọn tất cả</Button>
            <Button type="button" onClick={this.onSelectAllFriends(false)}>Bỏ chọn</Button>
          </ButtonGroup>
          <Button onClick={this.onSendInvitation} bsStyle="primary">Gửi lời mời</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

InviteResidentToEventModal.propTypes = {
  ...InvitationToEventModal.propTypes,
  building: PropTypes.string.isRequired,
  loadMoreRows: PropTypes.func.isRequired,
};

export default compose(
  withStyles(s),
  graphql(ResidentsInBuildingQuery, {
    options: props => ({
      variables: {
        building: props.building,
      },
    }),
    props: ({ data }) => {
      const loadMoreRows = throttle(() => data.fetchMore({
        variables: {
          ...data.variables,
          page: data.residentsInBuilding.pageInfo.page + 1,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => update(previousResult, {
          residentsInBuilding: {
            edges: {
              $push: fetchMoreResult.residentsInBuilding.edges,
            },
            pageInfo: {
              $set: fetchMoreResult.residentsInBuilding.pageInfo,
            },
          },
        }),
      }), 300);

      return {
        data,
        loadMoreRows,
      };
    },
  }),
)(InviteResidentToEventModal);
