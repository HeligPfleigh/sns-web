import React, { PropTypes } from 'react';
import { Modal, Button, Image } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './InviteToEventModal.scss';

class InviteToEventModal extends React.Component {
  constructor(props) {
    super(props);
    const { invites } = props;
    const friendSelected = [];
    invites.forEach((friend) => {
      friendSelected.push(friend._id);
    });
    this.state = {
      friendSelected,
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

  onFriendSelect = (friendId) => {
    const { friendSelected } = this.state;
    if (friendSelected.includes(friendId)) {
      this.setState({
        friendSelected: friendSelected.filter(friend => friend !== friendId),
      });
    } else {
      friendSelected.push(friendId);
      this.setState({
        friendSelected,
      });
    }
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
        <Modal.Body>
          <div className={s.ListFriendForInvite}>
            <div className={s.ListFriendWrapper}>
              {
                friends.map(friend => (
                  <table
                    style={{
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      this.onFriendSelect(friend._id);
                    }}
                    cols={3}
                    className={s.ItemFriend}
                  >
                    <tbody>
                      <tr>
                        <td>
                          <Image
                            src={friend.profile.picture}
                          />
                        </td>
                        <td className={s.ItemFriendMiddle}>
                          <div>
                            <span>{`${friend.profile.firstName} ${friend.profile.lastName}`}</span>
                          </div>
                        </td>
                        <td>
                          {
                            friendSelected.includes(friend._id) ? <i className="fa fa-check-circle-o" aria-hidden="true"></i> : <i className="fa fa-circle-o" aria-hidden="true"></i>
                          }
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  ))
              }
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={this.sendInvite}
            bsStyle="primary"
          >
            Gửi lời mời
          </Button>
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
