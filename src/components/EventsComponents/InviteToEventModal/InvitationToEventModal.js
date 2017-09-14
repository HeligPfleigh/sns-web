import { Component } from 'react';
import PropTypes from 'prop-types';

class InvitationToEventModal extends Component {
  constructor(props, ...args) {
    super(props, ...args);

    const { invitedFriends } = props;

    this.state = {
      friendSelected: invitedFriends.map(friend => friend._id),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.invitedFriends !== nextProps.invitedFriends) {
      const { invitedFriends } = nextProps;
      const friendSelected = [];
      invitedFriends.forEach((friend) => {
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

  onSendInvitation = async () => {
    await this.props.sendInvitation(this.state.friendSelected);
    this.props.closeModal();
  }
}

InvitationToEventModal.propTypes = {
  show: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  ignoreFriends: PropTypes.array.isRequired,
  sendInvitation: PropTypes.func.isRequired,
  invitedFriends: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
};

InvitationToEventModal.defaultProps = {
  show: false,
  ignoreFriends: [],
  user: {},
};

export default InvitationToEventModal;

