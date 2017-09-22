import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { compose } from 'react-apollo';
import { generate as idRandom } from 'shortid';
import { ButtonGroup, Button, Dropdown, MenuItem } from 'react-bootstrap';
import Link from '../../components/Link';
import {
  FRIEND,
  STRANGER,
  FRIEND_REQUESTED,
  RESPOND_TO_FRIEND_REQUEST,
  REJECTED_FRIEND,
} from '../../constants';
import s from './Search.scss';

const CustomToggle = ({ onClick, children }) => (
  <Button onClick={onClick}>
    { children }
  </Button>
);

CustomToggle.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node,
};

class SearchItem extends Component {

  onDropDown = (eventKey, e) => {
    e.preventDefault();
    const { dataUser, cancelFriendRequested, sendUnfriendRequest, rejectFriendAction } = this.props;
    if (eventKey === 'CANCEL_FRIEND_REQUESTED') {
      cancelFriendRequested(dataUser._id, dataUser);
    }
    if (eventKey === 'UNFRIEND') {
      sendUnfriendRequest(dataUser._id, dataUser);
    }
    if (eventKey === 'REJECTED') {
      rejectFriendAction(dataUser._id, dataUser);
    }
  }

  onAcceptClick = (evt) => {
    evt.preventDefault();
    const { dataUser, acceptFriendAction } = this.props;
    acceptFriendAction(dataUser._id, dataUser);
  }

  addFriend = (evt) => {
    evt.preventDefault();
    const { dataUser, sendFriendRequest } = this.props;
    sendFriendRequest(dataUser._id, dataUser);
  }

  render() {
    const { dataUser } = this.props;
    return (
      <div key={idRandom()} className={s.friendsContent}>
        <Link to={`/user/${dataUser._id}`} style={{ textDecoration: 'none' }}>
          <img className={s.friendsAvatar} src={dataUser.profile.picture} />
          <div style={{ float: 'left' }}>
            <span className={s.friendsName}>
              {dataUser.profile.firstName} {dataUser.profile.lastName}
            </span>
            <small className={s.mutualFriends}>{ dataUser.mutualFriends } bạn chung</small>
          </div>
        </Link>
        { dataUser.friendStatus === FRIEND &&
          <ButtonGroup className={s.buttons}>
            <Dropdown
              id={idRandom()}
            >
              <CustomToggle bsRole="toggle">
                <i className="fa fa-caret-down" aria-hidden="true" style={{ marginRight: '5px' }}></i>
                Bạn bè
              </CustomToggle>
              <Dropdown.Menu onSelect={this.onDropDown}>
                <MenuItem eventKey="UNFRIEND" >Hủy bạn bè</MenuItem>
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown
              id={idRandom()}
            >
              <CustomToggle bsRole="toggle">
                <i className="fa fa-ellipsis-h" aria-hidden="true" style={{ marginRight: '5px' }}></i>
                <i className="fa fa-caret-down" aria-hidden="true"></i>
              </CustomToggle>
              <Dropdown.Menu onSelect={this.onDropDown}>
                <MenuItem eventKey="SEND_MESSAGE" >Gửi tin nhắn</MenuItem>
              </Dropdown.Menu>
            </Dropdown>
          </ButtonGroup>
        }
        { dataUser.friendStatus === STRANGER &&
          <ButtonGroup className={s.buttons}>
            <Button onClick={this.addFriend}>
              <i className="fa fa-user-plus" aria-hidden="true" style={{ marginRight: '5px' }}></i>
              Thêm bạn
            </Button>
            <Dropdown
              id={idRandom()}
            >
              <CustomToggle bsRole="toggle">
                <i className="fa fa-ellipsis-h" aria-hidden="true" style={{ marginRight: '5px' }}></i>
                <i className="fa fa-caret-down" aria-hidden="true"></i>
              </CustomToggle>
              <Dropdown.Menu onSelect={this.onDropDown}>
                <MenuItem eventKey="SEND_MESSAGE" >Gửi tin nhắn</MenuItem>
              </Dropdown.Menu>
            </Dropdown>
          </ButtonGroup>
        }
        { dataUser.friendStatus === FRIEND_REQUESTED &&
          <ButtonGroup className={s.buttons}>
            <Button disabled >
              <i className="fa fa-user-plus" aria-hidden="true" style={{ marginRight: '5px' }}></i>
              Đã gửi yêu cầu
            </Button>
            <Dropdown
              id={idRandom()}
            >
              <CustomToggle bsRole="toggle">
                <i className="fa fa-ellipsis-h" aria-hidden="true" style={{ marginRight: '5px' }}></i>
                <i className="fa fa-caret-down" aria-hidden="true"></i>
              </CustomToggle>
              <Dropdown.Menu onSelect={this.onDropDown}>
                <MenuItem eventKey="SEND_MESSAGE" >Gửi tin nhắn</MenuItem>
                <MenuItem eventKey="CANCEL_FRIEND_REQUESTED" >Hủy yêu cầu</MenuItem>
              </Dropdown.Menu>
            </Dropdown>
          </ButtonGroup>
        }
        { dataUser.friendStatus === RESPOND_TO_FRIEND_REQUEST &&
          <ButtonGroup className={s.buttons}>
            <Button onClick={this.onAcceptClick}>
              <i className="fa fa-user-plus" aria-hidden="true" style={{ marginRight: '5px' }}></i>
              Xác nhận
            </Button>
            <Dropdown
              id={idRandom()}
            >
              <CustomToggle bsRole="toggle">
                <i className="fa fa-ellipsis-h" aria-hidden="true" style={{ marginRight: '5px' }}></i>
                <i className="fa fa-caret-down" aria-hidden="true"></i>
              </CustomToggle>
              <Dropdown.Menu onSelect={this.onDropDown}>
                <MenuItem eventKey="SEND_MESSAGE" >Gửi tin nhắn</MenuItem>
                <MenuItem eventKey="REJECTED" >Từ chối kết bạn</MenuItem>
              </Dropdown.Menu>
            </Dropdown>
          </ButtonGroup>
        }
        { dataUser.friendStatus === REJECTED_FRIEND && <div></div>}
      </div>
    );
  }
}

SearchItem.propTypes = {
  dataUser: PropTypes.object,
  sendFriendRequest: PropTypes.func,
  cancelFriendRequested: PropTypes.func,
  sendUnfriendRequest: PropTypes.func,
  acceptFriendAction: PropTypes.func,
  rejectFriendAction: PropTypes.func,
};

export default compose(
  withStyles(s),
)(SearchItem);
