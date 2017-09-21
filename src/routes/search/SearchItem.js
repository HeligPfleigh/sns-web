import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { compose } from 'react-apollo';
import { generate as idRandom } from 'shortid';
import { ButtonGroup, Button, Dropdown, MenuItem } from 'react-bootstrap';
import Link from '../../components/Link';
// import {
//   FRIEND,
//   UNFRIEND,
// } from '../../constants';
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
  constructor(props) {
    super(props);
    this.state = {
      friendRequested: false,
    };
  }

  onCLick = (evt) => {
    evt.preventDefault();
    const { dataUser, handleFriendAction } = this.props;
    this.setState({
      friendRequested: true,
    });
    handleFriendAction(dataUser._id);
  }

  render() {
    const { dataUser } = this.props;
    const { friendRequested } = this.state;
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
        { dataUser.isFriend ?
          <ButtonGroup className={s.buttons}>
            <Dropdown
              id={idRandom()}
            >
              <CustomToggle bsRole="toggle">
                <i className="fa fa-caret-down" aria-hidden="true" style={{ marginRight: '5px' }}></i>
                Bạn bè
              </CustomToggle>
              <Dropdown.Menu onSelect={this.onDropDown}>
                <MenuItem eventKey="" >Hủy bạn bè</MenuItem>
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
                <MenuItem eventKey="" >Gửi tin nhắn</MenuItem>
              </Dropdown.Menu>
            </Dropdown>
          </ButtonGroup> :
          <ButtonGroup className={s.buttons}>
            {
              !friendRequested ?
                <Button onClick={this.onCLick}>
                  <i className="fa fa-user-plus" aria-hidden="true" style={{ marginRight: '5px' }}></i>
                  Thêm bạn
                </Button> :
                <Button>
                  <i className="fa fa-user-plus" aria-hidden="true" style={{ marginRight: '5px' }}></i>
                  Đã gửi yêu cầu
                </Button>
            }
            <Dropdown
              id={idRandom()}
            >
              <CustomToggle bsRole="toggle">
                <i className="fa fa-ellipsis-h" aria-hidden="true" style={{ marginRight: '5px' }}></i>
                <i className="fa fa-caret-down" aria-hidden="true"></i>
              </CustomToggle>
              <Dropdown.Menu onSelect={this.onDropDown}>
                <MenuItem eventKey="" >Gửi tin nhắn</MenuItem>
                { friendRequested &&
                  <MenuItem eventKey="" >Hủy yêu cầu</MenuItem>
                }
              </Dropdown.Menu>
            </Dropdown>
          </ButtonGroup>
        }
      </div>
    );
  }
}

SearchItem.propTypes = {
  dataUser: PropTypes.object,
  handleFriendAction: PropTypes.func,
};

export default compose(
  withStyles(s),
)(SearchItem);
