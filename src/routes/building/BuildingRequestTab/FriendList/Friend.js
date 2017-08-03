import React, { PropTypes, Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Button, ButtonToolbar } from 'react-bootstrap';
import { ACCEPTED, REJECTED } from '../../../../constants';
import Link from '../../../../components/Link';
import s from './FriendStyle.scss';

class Friend extends Component {

  render() {
    const { friend } = this.props;
    return (<li key={friend._id}>
      <div className={s.friend} onClick={this.handleClickFriend}>
        <div className={s.friendAvatar}>
          <img alt={friend.profile && friend.profile.firstName} src={friend.profile && friend.profile.picture} />
        </div>
        <div className={s.friendInfo}>
          <div className={s.friendName}>
            <Link to={`/user-approval/${friend._id}`} style={{ textDecoration: 'none' }}>
              <span>{friend.profile.firstName} {friend.profile.lastName}</span>
            </Link>
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
