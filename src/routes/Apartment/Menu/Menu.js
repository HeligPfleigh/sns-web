import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'react-apollo';
import { Image } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Menu.scss';
import MenuVertical from '../../../components/MenuVertical';

const menus = [{
  icon: 'fa fa-bullhorn',
  text: 'Thông báo',
  key: 'notifications',
  url: '/notifications',
}, {
  icon: 'fa fa-money',
  text: 'Phí dịch vụ',
  key: 'service_fee',
  url: '/service_fee',
}, {
  icon: 'fa fa-bar-chart',
  text: 'Biểu đồ phí',
  key: 'fee_chart',
  url: '/fee_chart',
}, {
  icon: 'fa fa-commenting',
  text: 'Góp ý',
  key: 'feedbacks',
  url: '/feedbacks',
}, {
  icon: 'fa fa-book',
  text: 'Sổ tay chi tiêu',
  key: 'expense',
  url: '/expense',
}, {
  icon: 'fa fa-database',
  text: 'Dịch vụ',
  key: 'services',
  url: '/services',
}, {
  icon: 'fa fa-cog',
  text: 'Tiện ích',
  key: 'utility',
  url: '/utility',
}];

class Menu extends Component {

  onMenuSelected = () => {
  }

  render() {
    const { parentPath, pageKey, user, apartment } = this.props;
    return (
      <div className={s.menuLeftClass}>
        <div className={s.inforManager}>
          <Image
            style={{ margin: '8px' }}
            src={user && user.profile && user.profile.picture}
            circle width={45} height={45}
          />
          <div className={s.userInfo}>
            <h5>{`${user.profile.firstName} ${user.profile.lastName}`}</h5>
            {apartment && <span>{`Căn hộ ${apartment.name}`}</span>}
          </div>
        </div>
        <MenuVertical parentPath={parentPath} pageKey={pageKey} menus={menus} />
      </div>
    );
  }
}

Menu.propTypes = {
  user: PropTypes.object.isRequired,
  parentPath: PropTypes.string.isRequired,
  pageKey: PropTypes.string.isRequired,
  apartment: PropTypes.object,
};

export default compose(
  withStyles(s),
)(Menu);

