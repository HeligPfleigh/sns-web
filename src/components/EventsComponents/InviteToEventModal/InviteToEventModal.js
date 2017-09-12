import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Modal, ButtonGroup, Button, Image, Clearfix } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import classNames from 'classnames';
import s from './InviteToEventModal.scss';

class InviteToEventModal extends Component {
  constructor(props, ...args) {
    super(props, ...args);

    const { invites, friends } = props;

    this.state = {
      friendSelected: props.invites.map(friend => friend._id),
      selectedAllFrends: !(invites.length === friends.length),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.invites !== nextProps.invites) {
      const { invites } = nextProps;
      const friendSelected = [];
      invites.forEach((friend) => {
        friendSelected.push(friend._id);
      });
      this.state = {
        friendSelected,
      };
    }
  }

  onFriendClick = friendId => (event) => {
    event.preventDefault();

    let { friendSelected } = this.state;
    if (friendSelected.includes(friendId)) {
      friendSelected = friendSelected.filter(friend => friend !== friendId);
    } else {
      friendSelected.push(friendId);
    }

    this.setState({
      friendSelected,
    });
  }

  onSelectAllFriends = selectedAllFrends => (event) => {
    event.preventDefault();

    this.setState({
      friendSelected: selectedAllFrends ? this.props.friends.map(friend => friend._id) : [],
      selectedAllFrends,
    });
  }

  sendInvite = async () => {
    await this.props.onSendInviteClicked(this.state.friendSelected);
    this.props.closeModal();
  }

  render() {
    const { friends } = this.props;
    const { friendSelected } = this.state;
    return (
      <Modal show={this.props.show} onHide={this.props.closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Mời</Modal.Title>
        </Modal.Header>
        <Modal.Body className={s.list}>
          { friends.map((friend) => {
            const hasSelected = friendSelected.includes(friend._id);
            return (
              <Row className={classNames(s.friend, { active: hasSelected })} onClick={this.onFriendClick(friend._id)} key={friend._id}>
                <Col xs={2}>
                  <Image src={friend.profile.picture} thumbnail responsive />
                </Col>
                <Col xs={9} className={s.fullName}>
                  {`${friend.profile.firstName} ${friend.profile.lastName}`}
                </Col>
                <Col xs={1} className={s.iconCheck}>
                  {hasSelected ? <i className="fa fa-check-circle-o" aria-hidden="true"></i> : <i className="fa fa-circle-o" aria-hidden="true"></i>}
                </Col>
              </Row>);
          },
          )}
          <Clearfix />
        </Modal.Body>
        <Modal.Footer>
          <ButtonGroup className="pull-left">
            <Button type="button" onClick={this.onSelectAllFriends(true)}>Chọn tất cả</Button>
            <Button type="button" onClick={this.onSelectAllFriends(false)}>Bỏ chọn</Button>
          </ButtonGroup>
          <Button onClick={this.sendInvite} bsStyle="primary">Gửi lời mời</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

InviteToEventModal.propTypes = {
  show: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  friends: PropTypes.array.isRequired,
  onSendInviteClicked: PropTypes.func.isRequired,
  invites: PropTypes.array.isRequired,
};

export default withStyles(s)(InviteToEventModal);
