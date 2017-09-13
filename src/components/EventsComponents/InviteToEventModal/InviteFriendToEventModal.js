import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Modal, ButtonGroup, Button, Image, Clearfix } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import classNames from 'classnames';
import { graphql, compose } from 'react-apollo';

import FriendsQuery from './FriendsQuery.graphql';
import InvitationToEventModal from './InvitationToEventModal';
import s from './InviteToEventModal.scss';

class InviteFriendToEventModal extends InvitationToEventModal {
  constructor(props, ...args) {
    super(props, ...args);

    const { invitedFriends, friends } = props;

    this.state = {
      ...this.state,
      selectedAllFrends: !(invitedFriends.length === friends.length),
    };
  }

  onSelectAllFriends = selectedAllFrends => (event) => {
    event.preventDefault();

    this.setState({
      friendSelected: selectedAllFrends ? this.props.friends.map(friend => friend._id) : [],
      selectedAllFrends,
    });
  }

  render() {
    const { friends, ignoreFriends } = this.props;
    const { friendSelected } = this.state;
    const validFriends = friends.filter(f => ignoreFriends.indexOf(f._id) === -1);
    return (
      <Modal show={this.props.show} onHide={this.props.closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Gửi lời mời tham gia sự kiện tới các thành viên khác</Modal.Title>
        </Modal.Header>
        <Modal.Body className={s.list}>
          { validFriends.map((friend) => {
            const hasSelected = friendSelected.includes(friend._id);
            return (
              <Row className={classNames(s.friend, { active: hasSelected })} onClick={this.onFriendClick(friend._id)} key={friend._id}>
                <Col xs={2}>
                  <Image src={friend.profile.picture} thumbnail responsive />
                </Col>
                <Col xs={9} className={s.fullName}>
                  {friend.profile.fullName}
                </Col>
                <Col xs={1} className={s.iconCheck}>
                  {hasSelected ? <i className="fa fa-check-circle-o" aria-hidden="true"></i> : <i className="fa fa-circle-o" aria-hidden="true"></i>}
                </Col>
              </Row>);
          })}
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

InviteFriendToEventModal.propTypes = {
  ...InvitationToEventModal.propTypes,
  friends: PropTypes.array.isRequired,
};

export default compose(
  withStyles(s),
  graphql(FriendsQuery, {
    props: ({ data }) => {
      const { me } = data;
      const friends = me ? me.friends : [];
      return {
        friends,
      };
    },
  }),
)(InviteFriendToEventModal);
