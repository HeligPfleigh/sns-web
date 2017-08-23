import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'react-apollo';
import { Button } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Menu.scss';
import MenuVertical from '../../MenuVertical';

const currentDate = new Date();

const menus = [{
  text: 'Upload file phí',
  key: 'upload_file',
}, {
  text: 'Quản lý phí',
  key: 'fee_management',
}, {
  text: 'Thông báo phí',
  key: 'noti_fê',
}, {
  text: 'Thông báo khác',
  key: 'noti_other',
}];

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCreateEventModal: false,
    };
  }


  onMenuSelected = () => {
  }

  onCreateEvent = () => {
    this.setState({
      showCreateEventModal: true,
    });
  }

  closeModal = () => {
    this.setState({
      showCreateEventModal: false,
    });
  }

  render() {
    const { user } = this.props;
    return (
      <div className={s.menuLeftClass}>
        <div className={s.inforManager}>
          <i className="fa fa-user" aria-hidden="true"></i>
          <div className={s.nameManager}>
            <h5>{`${user.profile.firstName} ${user.profile.lastName}`}</h5>
            <span>Ban quản lý</span>
          </div>
        </div>
        <MenuVertical
          menus={menus}
          onItemSelected={(idx) => { this.onMenuSelected(idx); }}
        />
      </div>
    );
  }
}

Menu.propTypes = {
  user: PropTypes.object.isRequired,
};

export default compose(
  withStyles(s),
)(Menu);

