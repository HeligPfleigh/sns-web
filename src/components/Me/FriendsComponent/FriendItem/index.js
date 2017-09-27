import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Col, Image, Button } from 'react-bootstrap';
import Link from '../../../Link';
import s from './styles.scss';
import history from '../../../../core/history';

class FriendItem extends Component {

  onRedirect = () => {
    const { friend: { _id } } = this.props;
    history.push(`/apartment/${_id}`);
  }

  render() {
    const { friend } = this.props;

    return (
      <Col style={{ marginBottom: 10 }} md={6} >
        <div className={s.friend}>
          <div className={s.friendAvatar}>
            <Link to={`/user/${friend._id}`}>
              <Image
                alt={friend.profile && friend.profile.firstName}
                src={friend.profile && friend.profile.picture}
                title={friend.profile && `${friend.profile.firstName} ${friend.profile.lastName}`}
              />
            </Link>
          </div>
          <div className={s.friendInfo}>
            <div className={s.friendName}>
              <Link to={`/user/${friend._id}`}>
                <span>{friend.profile.firstName} {friend.profile.lastName}</span>
              </Link>
            </div>
            <div>{`Có ${friend.totalFriends} bạn`}</div>
          </div>
          <div className={s.status}>
            <Button title="Bạn bè" bsSize="small">
              <i className="fa fa-check" />Bạn bè
            </Button>
          </div>
        </div>
      </Col>
    );
  }
}

FriendItem.propTypes = {
  friend: PropTypes.object.isRequired,
};

export default withStyles(s)(FriendItem);
