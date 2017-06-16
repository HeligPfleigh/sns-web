import React, { PropTypes, Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Button, ButtonToolbar } from 'react-bootstrap';
import { ACCEPTED, REJECTED } from '../../../constants';
import s from './FriendStyle.scss';

export class Friend extends Component {

  render() {
    const { friend } = this.props;
    return (<li key={friend._id}>
      <div className={s.friend} onClick={this.handleClickFriend}>
        <div className={s.friendAvatar}>
          <img alt={friend.profile && friend.profile.firstName} src={friend.profile && friend.profile.picture} />
        </div>
        <div className={s.friendInfo}>
          <div className={s.friendName}>
            <span>{friend.profile.firstName} {friend.profile.lastName}</span>
          </div>
          <ButtonToolbar>
            <Button onClick={this.props.onAccept} bsStyle="primary">{ ACCEPTED }</Button>
            <Button onClick={this.props.onCancel} >{ REJECTED }</Button>
          </ButtonToolbar>
        </div>
      </div>
    </li>);
  }
}

Friend.propTypes = {
  friend: PropTypes.object.isRequired,
  onAccept: PropTypes.func,
  onCancel: PropTypes.func,
};

export default withStyles(s)(Friend);
